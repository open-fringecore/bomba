import dgram from 'dgram';
import {useEffect} from 'react';
import useBroadcast from './broadcast.js';
import {addPeer} from '../stores/baseStore.js';

export const useUdpServer = (
	NAME: string,
	BROADCAST_ADDR: string,
	MY_IP: string,
	UDP_PORT: number,
	HTTP_PORT: number,
) => {
	const {broadcast} = useBroadcast();

	useEffect(() => {
		const server = dgram.createSocket('udp4');
		server.bind(UDP_PORT);

		const initialBroadcast = () => {
			const msg = {
				method: 'SELF',
				name: NAME,
				ip: MY_IP,
				httpPort: HTTP_PORT,
				isBroadcast: true,
			};

			broadcast(server, BROADCAST_ADDR, UDP_PORT, JSON.stringify(msg));
		};

		server.on('listening', function () {
			const address = server.address();
			console.log(`Listening on ${address.address}:${address.port}`);
			server.setBroadcast(true);

			initialBroadcast();
		});

		server.on('message', (msg, rinfo) => {
			if (rinfo.address == MY_IP) {
				return;
			}

			console.log(
				`<-- Server received: ${msg} from ${rinfo.address}:${rinfo.port}`,
			);

			const data = JSON.parse(msg?.toString());

			if (data?.method == 'SELF') {
				const isAlreadyAdded = !addPeer({
					ip: rinfo.address,
					name: data.name,
					isSending: false,
					httpPort: data?.httpPort,
				});

				if (!isAlreadyAdded || data?.isBroadcast) {
					const message = JSON.stringify({
						method: 'SELF',
						name: NAME,
						ip: MY_IP,
						httpPort: HTTP_PORT,
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
