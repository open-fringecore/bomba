import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import {Spinner} from '../Misc/Spinner.js';
import dgram from 'dgram';
import useBroadcast from '../../functions/broadcast.js';
import express, {Request, Response} from 'express';
import {useFileDownloader} from '../../functions/useFileDownloader.js';

const MY_IP = '192.168.68.204';
const MY_UDP_PORT = 9040;
const MY_TCP_PORT = 3040;
const OTHER_TCP_PORT = 6969;
const BROADCAST_ADDR = '192.168.68.255';
const SENDER_PORT = 9039;

const Receiver = () => {
	const [isReceiving, setIsReceiving] = useState(false);

	const {broadcast} = useBroadcast();

	useEffect(() => {
		const app = express();

		app.get('/request-to-receive', (req, res) => {
			console.log(`✅✅✅ Receive request acknowledged`);

			useFileDownloader(req.ip, OTHER_TCP_PORT);

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

	useEffect(() => {
		const server = dgram.createSocket('udp4');
		server.bind(MY_UDP_PORT);

		// ! Initial Broadcast
		const initialBroadcast = () => {
			const msg = {
				method: 'RECEIVE',
				name: 'Mr. Zeus',
			};
			broadcast(server, BROADCAST_ADDR, SENDER_PORT, JSON.stringify(msg));
		};
		initialBroadcast();

		server.on('listening', function () {
			const address = server.address();
			console.log(`UDP Client listening on ${address.address}:${address.port}`);
			server.setBroadcast(true);
		});

		server.on('message', function (message, remote) {
			console.log(
				`← Received message from ${remote.address}:${remote.port} - ${message}`,
			);

			const data = JSON.parse(message?.toString());
			if (data?.method == 'SEND') {
				console.log(
					`→ → Sending TCP Acknowledgement to ${remote.address}:${remote.port}`,
				);
			}
		});

		return () => {};
	}, []);

	return (
		<Box flexDirection="column">
			{isReceiving && (
				<Text>
					<Spinner /> Receiving
				</Text>
			)}
			{/* <SenderList /> */}
		</Box>
	);
};

export default Receiver;
