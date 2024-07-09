import express from 'express';
import {useEffect} from 'react';
import fs from 'fs';
import path from 'path';

export const useHttpServer = (
	MY_IP: string,
	TCP_PORT: number,
	isSending: boolean,
	sendingFileNames: string[] | null,
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
			const filePath = `${process.cwd()}/send_files/${filename}`;

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
