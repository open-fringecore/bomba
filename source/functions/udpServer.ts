import dgram from 'dgram';
import {useCallback, useEffect} from 'react';
import useBroadcast from './broadcast.js';
import {$users, addUser} from '../stores/baseStore.js';

export const useUdpServer = (
	NAME: string,
	BROADCAST_ADDR: string,
	MY_IP: string,
	UDP_PORT: number,
	HTTP_PORT: number,
	sendHttpDiscoverMe: (ip: string) => void,
) => {
	const {broadcast} = useBroadcast();

	useEffect(() => {
		const server = dgram.createSocket('udp4');
		server.bind(UDP_PORT);

		const initialBroadcast = () => {
			const msg = {
				method: 'DISCOVER',
				name: NAME,
				ip: MY_IP,
				httpPort: HTTP_PORT,
			};
			broadcast(server, BROADCAST_ADDR, UDP_PORT, JSON.stringify(msg));
		};
		initialBroadcast();

		server.on('listening', function () {
			const address = server.address();
			console.log(`Listening on ${address.address}:${address.port}`);
			server.setBroadcast(true);
		});

		server.on('message', (msg, rinfo) => {
			if (rinfo.address == MY_IP) {
				return;
			}

			console.log(
				`<-- Server received: ${msg} from ${rinfo.address}:${rinfo.port}`,
			);
			const data = JSON.parse(msg?.toString());
			if (data?.method == 'DISCOVER') {
				addUser({
					ip: rinfo.address,
					name: data.name,
				});
			}
			sendHttpDiscoverMe(rinfo.address);
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
