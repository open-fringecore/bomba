import dgram from 'dgram';
import {useEffect} from 'react';
import useBroadcast from './broadcast.js';
import {addDiscoveredPeer} from '../stores/peersStore.js';

export const useUdpServer = (
	MY_ID: string,
	NAME: string,
	BROADCAST_ADDR: string,
	MY_IP: string,
	UDP_PORT: number,
	HTTP_PORT: number,
) => {
	const {broadcast} = useBroadcast();

	useEffect(() => {
		const server = dgram.createSocket({type: 'udp4'});
		server.bind(UDP_PORT);

		const msg = {
			method: 'SELF',
			name: NAME,
			id: MY_ID,
			ip: MY_IP,
			httpPort: HTTP_PORT,
			isBroadcast: true,
		};

		const initialBroadcast = () => {
			broadcast(server, BROADCAST_ADDR, UDP_PORT, JSON.stringify(msg));
		};

		server.on('listening', function () {
			const address = server.address();
			console.log(`Listening on ${address.address}:${address.port}`);
			server.setBroadcast(true);

			initialBroadcast();
		});

		server.on('message', (receivedMsg, rinfo) => {
			if (rinfo.address == MY_IP) {
				return;
			}

			const data = JSON.parse(receivedMsg?.toString());

			console.log(`<-- Received From: ${rinfo.address}:${rinfo.port}`);
			console.log('DATA:', data);

			if (data?.method == 'SELF') {
				const isAlreadyAdded = !addDiscoveredPeer({
					id: data.id,
					ip: rinfo.address,
					name: data.name,
					httpPort: data?.httpPort,
				});

				if (!isAlreadyAdded || data?.isBroadcast) {
					const message = JSON.stringify({
						...msg,
						isBroadcast: false,
					});

					server.send(message, rinfo.port, rinfo.address);
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
