import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import {Spinner} from '../Misc/Spinner.js';
import dgram from 'dgram';
import useBroadcast from '../../functions/broadcast.js';
import express, {Request, Response} from 'express';
import {useFileDownloader} from '../../functions/useFileDownloader.js';
import {useReceiverTcpServer} from '../../functions/receiverTcpServer.js';

const MY_IP = '192.168.0.105'; // FIXME: FIX Static
const MY_UDP_PORT = 9040;
const MY_TCP_PORT = 3040;
const OTHER_TCP_PORT = 6969;
const BROADCAST_ADDR = '192.168.0.255'; // FIXME: FIX Static
const SENDER_PORT = 9039;

const Receiver = () => {
	const [isReceiving, setIsReceiving] = useState(false);

	const {broadcast} = useBroadcast();
	useReceiverTcpServer(MY_IP, MY_TCP_PORT, OTHER_TCP_PORT);

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
				// TODO:: Handle Multiple Senders here.

				console.log(
					`→ → Sending TCP Acknowledgement to ${remote.address}:${remote.port}`,
				);
			}
		});

		const sendTcpSendRequest = (_IP: string, _PORT: number) => {
			const url = `http://${_IP}:${OTHER_TCP_PORT}/request-to-send`;

			fetch(url)
				.then(response => response.json())
				.then(data => {
					console.log(data);
				})
				.catch(error => {
					console.error('Error:', error);
				});
		};

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
