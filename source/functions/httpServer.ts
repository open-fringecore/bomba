import express from 'express';
import {useEffect} from 'react';
import fs from 'fs';
import path from 'path';
import {hashFile, hashFolder} from '@/functions/useHashCheck.js';
import {log, logError} from '@/functions/log.js';
import {SEND_PATH} from '@/functions/variables.js';
import {Files, SendingFiles, TransferStates} from '@/types/storeTypes.js';
// import {default as tarFs} from 'tar-fs';
import {c} from 'tar';
import {updateTotalDownloaded} from '@/stores/fileHandlerStore.js';
import {
	initSenderTransfer,
	updateTransferErrorMsg,
	updateTransferredAmount,
	updateTransferredState,
} from '@/stores/senderFileHandlerStore.js';
import {$sendingFiles} from '@/stores/baseStore.js';

export const useHttpServer = (
	MY_IP: string,
	TCP_PORT: number,
	isSending: boolean,
	sendingFileNames: SendingFiles | null,
) => {
	useEffect(() => {
		const app = express();
		app.use(express.json());

		app.get('/', (req, res) => {
			res.json({
				msg: 'Hoe!',
			});
		});

		app.get('/get-active-peer-info', (req, res) => {
			res.json({
				isSending,
				sendingFileNames,
			});
		});

		app.get('/get-active-peer', (req, res) => {
			setTimeout(() => {
				res.json({active: true});
			}, 10000);
		});

		app.get('/init-sender-transfer/*', (req, res) => {
			try {
				const peerID = (req.params as any)['0'];

				if (!peerID) {
					return res.status(400).json({msg: 'receiver peerID required.'});
				}

				initSenderTransfer(peerID);

				res.json({
					msg: 'transfer initialized',
				});
			} catch (error) {
				logError(error);
			}
		});

		app.get('/update-sender-transfer-state/*/*', (req, res) => {
			try {
				const peerID = (req.params as any)['0'];
				const state: TransferStates = (req.params as any)['1'];
				const error = req.query['error'] as string;

				if (!peerID) {
					return res.status(400).json({msg: 'receiver peerID required.'});
				}
				if (!state) {
					return res.status(400).json({msg: 'transfer state required.'});
				}

				updateTransferredState(peerID, state);
				if (error) {
					updateTransferErrorMsg(peerID, error);
				}

				res.json({
					msg: 'transfer state change acknowledged.',
				});
			} catch (error) {
				logError(error);
			}
		});

		app.get('/download/*/*', (req, res) => {
			try {
				const peerID = (req.params as any)['0'];
				const fileID = (req.params as any)['1'];

				if (!peerID) {
					return res.status(400).json({msg: 'receiver peerID required.'});
				}
				if (!fileID) {
					return res.status(400).json({msg: 'fileID required.'});
				}

				const filename = $sendingFiles.get()[fileID]?.fileName;
				if (!filename) {
					return res.status(400).json({msg: 'filename not found.'});
				}

				const filePath = path.join(SEND_PATH, filename);

				if (!fs.existsSync(filePath)) {
					return res.status(404).json({msg: 'File not found!', filePath});
				}

				updateTransferredState(peerID, 'TRANSFERRING');

				// const stat = fs.statSync(filePath);
				// const fileSize = stat.size;
				// res.setHeader('Content-Length', fileSize);

				res.setHeader(
					'Content-Disposition',
					`attachment; filename=${filename}`,
				);

				const fileStream = fs.createReadStream(filePath);
				fileStream.pipe(res);

				fileStream.on('data', chunk => {
					updateTransferredAmount(peerID, fileID, chunk.length);
				});

				fileStream.on('close', () => {});
				fileStream.on('end', () => {});

				fileStream.on('error', (err: any) => {
					logError('fileStream error:', err);
					res.status(500).end('Internal Server Error');
				});

				res.on('error', err => {
					logError('Response stream error:', err);
				});

				req.on('close', () => {
					fileStream.destroy();
				});
			} catch (error) {
				logError(error);
			}
		});

		app.get('/download-tar/*/*', (req, res) => {
			try {
				const peerID = (req.params as any)['0'];
				const fileID = (req.params as any)['1'];

				if (!peerID) {
					return res.status(400).json({msg: 'receiver peerID required.'});
				}
				if (!fileID) {
					return res.status(400).json({msg: 'fileID required.'});
				}

				const foldername = $sendingFiles.get()[fileID]?.fileName;
				if (!foldername) {
					return res.status(400).json({msg: 'foldername not found.'});
				}

				const folderPath = path.join(SEND_PATH, foldername);

				if (!fs.existsSync(folderPath)) {
					return res.status(404).json({msg: 'Folder not found!', folderPath});
				}

				updateTransferredState(peerID, 'TRANSFERRING');

				// const folderSize = getFolderSize(folderPath);

				res.setHeader('Content-Type', 'application/x-tar');
				// res.setHeader('Content-Length', folderSize);
				res.setHeader(
					'Content-Disposition',
					`attachment; filename=${foldername}.tar`,
				);

				// const pack = tarFs.pack(folderPath);
				const pack = c(
					{
						C: folderPath,
					},
					[''],
				);

				pack.on('error', (err: any) => {
					logError('Pack stream error:', err);
					res.status(500).end('Internal Server Error');
				});

				res.on('error', err => {
					logError('Response stream error:', err);
				});

				res.on('close', () => {});

				pack.on('data', chunk => {
					updateTransferredAmount(peerID, fileID, chunk.length);
				});

				pack.pipe(res);
			} catch (error) {
				logError(error);
			}
		});

		app.get('/get-hash/*', async (req, res) => {
			try {
				const fileID = (req.params as any)['0'];

				if (!fileID) {
					return res.status(400).json({msg: 'fileID required.'});
				}
				const filename = $sendingFiles.get()[fileID]?.fileName;
				if (!filename) {
					return res.status(400).json({msg: 'filename not found.'});
				}

				const filePath = path.join(SEND_PATH, filename);

				if (!fs.existsSync(filePath)) {
					return res.status(404).json({msg: 'File not found!!'});
				}

				try {
					const stats = fs.statSync(filePath);
					const hash = stats.isDirectory()
						? await hashFolder(filePath)
						: await hashFile(filePath);
					log(`Hash of ${filename} is -> ${hash}`);
					return res.status(200).json({msg: 'Hash Successful!', hash});
				} catch (err) {
					logError('Error hashing file:', err);
					return res.status(400).json({msg: 'Hash Failed!'});
				}
			} catch (error) {
				logError(error);
			}
		});

		const server = app.listen(TCP_PORT, MY_IP, () => {
			console.log(`Server is running on http://${MY_IP}:${TCP_PORT}`);
		});

		return () => {
			server.close(() => {
				log('Server stopped listening for requests.');
			});
		};
	}, []);
};
