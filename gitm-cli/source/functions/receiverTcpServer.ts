import express, {Request, Response} from 'express';
import path from 'path';
import {useEffect} from 'react';
import {useFileDownloader} from './useFileDownloader.js';

export const useReceiverTcpServer = (
	MY_IP: string,
	MY_TCP_PORT: number,
	OTHER_TCP_PORT: number,
) => {
	useEffect(() => {
		const app = express();

		app.get('/request-to-receive', (req, res) => {
			const {fileName} = req.query;
			console.log(`✅✅✅ Receive request acknowledged`, fileName);

			useFileDownloader(req.ip, OTHER_TCP_PORT, fileName as string);

			res.json('Downloading....');
		});

		const server = app.listen(MY_TCP_PORT, MY_IP, () => {
			console.log(`Server is running on http://localhost:${MY_TCP_PORT}`);
		});

		return () => {
			server.close(() => {
				console.log('Server stopped listening for requests.');
			});
		};
	}, []);
};
