import dgram from 'dgram';
import {useCallback, useEffect} from 'react';
import useBroadcast from './broadcast.js';
import {getRandomBanglaName} from './helper.js';

export const useUdpServer = (
	BROADCAST_ADDR: string,
	MY_UDP_PORT: number,
	OTHER_UDP_PORT: number,
	OTHER_TCP_PORT: number,
	fileName: string | undefined,
	isSending: boolean,
	setIsSending: (state: boolean) => void,
	sendTcpReceiveRequest: (ip: string) => void,
) => {
	const {broadcast} = useBroadcast();

	useEffect(() => {
		const server = dgram.createSocket('udp4');
		server.bind(MY_UDP_PORT);

		const initialBroadcast = () => {
			const name = getRandomBanglaName();
			console.log(`My name is: ${name}`);
			const msg = {
				method: 'SEND',
				name: name,
				fileName: fileName,
			};
			broadcast(server, BROADCAST_ADDR, OTHER_UDP_PORT, JSON.stringify(msg));
		};
		initialBroadcast();

		server.on('listening', function () {
			const address = server.address();
			console.log(`Listening on ${address.address}:${address.port}`);
			server.setBroadcast(true);
		});

		server.on('message', (msg, rinfo) => {
			console.log(
				`<---------------- Server received: ${msg} from ${rinfo.address}:${rinfo.port}`,
			);
			const data = JSON.parse(msg?.toString());
			if (data?.method == 'RECEIVE' && !isSending) {
				setIsSending(true);
				sendTcpReceiveRequest(rinfo.address);
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
