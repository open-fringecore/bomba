import express, {Request, Response} from 'express';
import path from 'path';
import {useEffect} from 'react';

export const useSenderTcpServer = (
	MY_IP: string,
	MY_TCP_PORT: number,
	filePath: string,
) => {
	useEffect(() => {
		const app = express();

		app.get('/download', (req: Request, res: Response) => {
			res.download(filePath, 'BRAIN.jpg', (err: any) => {
				if (err) {
					console.error('Error downloading the file:', err);
					if (!res.headersSent) {
						res.status(500).send('Error downloading the file');
					}
				}
			});
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
