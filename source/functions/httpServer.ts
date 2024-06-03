import express from 'express';
import {useEffect} from 'react';

export const useHttpServer = (MY_IP: string, TCP_PORT: number) => {
	useEffect(() => {
		const app = express();
		app.use(express.json());

		app.get('/', (req, res) => {
			res.json({
				msg: 'Hoe!',
			});
		});

		app.get('/get-active-status', (req, res) => {
			setTimeout(() => {
				console.log('⭕ Clearing Interval ⭕');
				res.json({active: true});
			}, 30000);
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
