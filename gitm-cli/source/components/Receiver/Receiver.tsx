import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import {Spinner} from '../Misc/Spinner.js';
import dgram from 'dgram';
import useBroadcast from '../../functions/broadcast.js';

const MY_PORT = 9040;
const BROADCAST_ADDR = '192.168.68.255';
const SENDER_PORT = 9039;

const Receiver = () => {
	const [isReceiving, setIsReceiving] = useState(false);

	const {broadcast} = useBroadcast();

	useEffect(() => {
		const server = dgram.createSocket('udp4');
		server.bind(MY_PORT);

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
