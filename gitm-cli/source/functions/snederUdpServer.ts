import dgram from 'dgram';
import {useEffect} from 'react';
import useBroadcast from './broadcast.js';

export const useSenderUdpServer = (
	BROADCAST_ADDR: string,
	MY_UDP_PORT: number,
	OTHER_UDP_PORT: number,
	OTHER_TCP_PORT: number,
	fileName: string | undefined,
	isSending: boolean,
	setIsSending: (state: boolean) => void,
) => {
	const {broadcast} = useBroadcast();

	useEffect(() => {
		const server = dgram.createSocket('udp4');
		server.bind(MY_UDP_PORT);

		// ! Initial Broadcast
		const initialBroadcast = () => {
			const msg = {
				method: 'SEND',
				name: 'Mr. Thor',
			};
			broadcast(server, BROADCAST_ADDR, OTHER_UDP_PORT, JSON.stringify(msg));
		};
		initialBroadcast();

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
			server.close();
		};
	}, []);
};
