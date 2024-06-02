import express from 'express';
import {useEffect} from 'react';
import {$users} from '../stores/baseStore.js';

export const useHttpServer = (MY_IP: string, TCP_PORT: number) => {
	useEffect(() => {
		const app = express();
		app.use(express.json());

		app.post('/discover', (req, res) => {
			$users.set([
				...$users.get(),
				{
					name: req.body.name,
					ip: req.body.ip,
				},
			]);

			res.json({
				msg: 'Discovery Successful!',
			});
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
