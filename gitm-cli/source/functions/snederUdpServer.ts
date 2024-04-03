import express, {Request, Response} from 'express';
import path from 'path';
import dgram from 'dgram';
import {useEffect} from 'react';

export const useSenderUdpServer = (
	MY_PORT: number,
	OTHER_TCP_PORT: number,
	fileName: string | undefined,
	isSending: boolean,
	setIsSending: (state: boolean) => void,
) => {
	useEffect(() => {
		const server = dgram.createSocket('udp4');
		server.bind(MY_PORT);

		server.on('listening', function () {
			const address = server.address();
			console.log(`Listening on ${address.address}:${address.port}`);
		});

		server.on('message', (msg, rinfo) => {
			console.log(
				`<---------------- Server received: ${msg} from ${rinfo.address}:${rinfo.port}`,
			);
			const data = JSON.parse(msg?.toString());
			if (data?.method == 'RECEIVE' && !isSending) {
				setIsSending(true);
				sendTcpReceiveRequest(rinfo.address, rinfo.port);
			}
		});

		const sendTcpReceiveRequest = (_IP: string, _PORT: number) => {
			const url = `http://${_IP}:${OTHER_TCP_PORT}/request-to-receive?fileName=${fileName}`;

			fetch(url)
				.then(response => response.json())
				.then(data => {
					console.log(data);
				})
				.catch(error => {
					console.error('Error:', error);
				});
		};

		server.on('error', err => {
			console.error(`server error:\n${err.stack}`);
			server.close();
		});

		return () => {
			console.log('Cleanup...');
			server.close();
		};
	}, []);
};
