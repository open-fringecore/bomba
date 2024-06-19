import express from 'express';
import {useEffect} from 'react';

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
				return res.json({
					isSending,
					sendingFileNames,
				});
			} else {
				setTimeout(() => {
					return res.json({active: true});
				}, 10000);
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
