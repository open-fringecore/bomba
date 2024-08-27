import express from 'express';
import {useEffect} from 'react';
import fs from 'fs';
import path from 'path';
import {SendingFiles} from '@/stores/baseStore.js';
import {hashFile} from '@/functions/useHashCheck.js';
import {log, logError} from '@/functions/log.js';
import {SEND_PATH} from '@/functions/variables.js';

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

		app.get('/get-active-peer', (req, res) => {
			if (typeof req.query['is_first_call'] == 'string') {
				res.json({
					isSending,
					sendingFileNames,
				});
			} else {
				setTimeout(() => {
					res.json({active: true});
				}, 10000);
			}
		});

		app.get('/download/:filename', (req, res) => {
			const {filename} = req.params;

			if (!filename) {
				return res.status(400).json({msg: 'filename required.'});
			}

			const filePath = `${SEND_PATH}/${filename}`;

			if (!fs.existsSync(filePath)) {
				return res.status(404).json({msg: 'File not found!', filePath});
			}

			const stat = fs.statSync(filePath);
			const fileSize = stat.size;

			res.setHeader('Content-Length', fileSize);
			res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

			const fileStream = fs.createReadStream(filePath);
			fileStream.pipe(res);

			// res.download(filePath, path.basename(filePath), err => {
			// 	if (err) {
			// 		logError('Error downloading file:', err);
			// 		res.status(500).send('Error downloading file');
			// 	}
			// });
		});

		app.get('/get-hash/:filename', async (req, res) => {
			const {filename} = req.params;

			if (!filename) {
				return res.status(400).json({msg: 'filename required.'});
			}

			const filePath = `${SEND_PATH}/${filename}`;

			if (!fs.existsSync(filePath)) {
				return res.status(404).json({msg: 'File not found!!'});
			}

			try {
				const hash = await hashFile(filePath);
				log(`Hash of the file is: ${hash}`);
				return res.status(200).json({msg: 'Hash Successful!', hash});
			} catch (err) {
				logError('Error hashing file:', err);
				return res.status(400).json({msg: 'Hash Failed!'});
			}
		});

		const server = app.listen(TCP_PORT, MY_IP, () => {
			log(`Server is running on http://${MY_IP}:${TCP_PORT}`);
		});

		return () => {
			server.close(() => {
				log('Server stopped listening for requests.');
			});
		};
	}, []);
};
