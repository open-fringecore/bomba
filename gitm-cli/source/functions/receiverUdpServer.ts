import dgram from 'dgram';
import {useEffect} from 'react';
import useBroadcast from './broadcast.js';
import {useFileDownloader} from './useFileDownloader.js';

export const useReceiverUdpServer = (
	BROADCAST_ADDR: string,
	MY_UDP_PORT: number,
	OTHER_UDP_PORT: number,
	OTHER_TCP_PORT: number,
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
			broadcast(server, BROADCAST_ADDR, OTHER_UDP_PORT, JSON.stringify(msg));
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

				if (data?.fileName) {
					console.log(
						`→ → Downloading ${data.fileName} from ${remote.address}:${remote.port}`,
					);
					useFileDownloader(
						remote.address,
						OTHER_TCP_PORT,
						data.fileName as string,
					);
				}
			}
		});

		server.on('error', err => {
			console.error(`server error:\n${err.stack}`);
			server.close();
		});

		return () => {
			server.close();
		};
	}, []);
};
