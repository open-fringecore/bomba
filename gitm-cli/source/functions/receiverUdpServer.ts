import express, {Request, Response} from 'express';
import path from 'path';
import dgram from 'dgram';
import {useEffect} from 'react';
import useBroadcast from './broadcast.js';

export const useReceiverUdpServer = (
	MY_UDP_PORT: number,
	OTHER_TCP_PORT: number,
	SENDER_PORT: number,
	BROADCAST_ADDR: string,
	isReceiving: boolean,
	setIsReceiving: (state: boolean) => void,
) => {
	const {broadcast} = useBroadcast();

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
};
