import express from 'express';
import {useEffect} from 'react';
import fs from 'fs';
import path from 'path';
import {SendingFiles} from '../stores/baseStore.js';
import {hashFile} from './useHashCheck.js';

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

			// const filePath = `${process.cwd()}/${filename}`;
			const filePath = `${process.cwd()}/send_files/${filename}`; // TODO:: Fix

			if (!fs.existsSync(filePath)) {
				return res.status(404).json({msg: 'File not found!'});
			}

			const stat = fs.statSync(filePath);
			const fileSize = stat.size;

			res.setHeader('Content-Length', fileSize);
			res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

			const fileStream = fs.createReadStream(filePath);
			fileStream.pipe(res);

			// res.download(filePath, path.basename(filePath), err => {
			// 	if (err) {
			// 		console.error('Error downloading file:', err);
			// 		res.status(500).send('Error downloading file');
			// 	}
			// });
		});

		app.get('/get-hash/:filename', async (req, res) => {
			// TODO:: Make const later
			let {filename} = req.params;
			if (filename == 'O.png') {
				// ! This is a deliberate error.
				filename = 'ooo.png';
			}

			if (!filename) {
				return res.status(400).json({msg: 'filename required.'});
			}

			// const filePath = `${process.cwd()}/${filename}`;
			const filePath = `${process.cwd()}/send_files/${filename}`; // TODO:: Fix

			if (!fs.existsSync(filePath)) {
				return res.status(404).json({msg: 'File not found!'});
			}

			try {
				const hash = await hashFile(filePath);
				console.log(`Hash of the file is: ${hash}`);
				return res.status(200).json({msg: 'Hash Successful!', hash});
			} catch (err) {
				console.error('Error hashing file:', err);
				return res.status(400).json({msg: 'Hash Failed!'});
			}
		});

		const server = app.listen(TCP_PORT, MY_IP, () => {
			console.log(`Server is running on http://${MY_IP}:${TCP_PORT}`);
		});

		return () => {
			server.close(() => {
				console.log('Server stopped listening for requests.');
			});
		};
	}, []);
};
