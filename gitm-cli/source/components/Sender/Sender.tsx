import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import SenderList from '../Misc/SenderList.js';
import {Spinner} from '../Misc/Spinner.js';
import dgram from 'dgram';
import useBroadcast from '../../functions/broadcast.js';
import {useFileDownloader} from '../../functions/useFileDownloader.js';

const MY_PORT = 9039;

const Sender = () => {
	const path = '/home/rifat/Works/gitm/gitm-cli/send_files' || process.cwd(); // FIXME: FIX Static
	const fileName = process.argv[3];
	const filePath = `${path}/${fileName}`;

	const [isSending, setIsSending] = useState(false);

	const {broadcast} = useBroadcast();
	useFileDownloader(filePath);

	useEffect(() => {
		const server = dgram.createSocket('udp4');
		server.bind(MY_PORT);

		server.on('listening', function () {
			const address = server.address();
			console.log(`Listening on ${address.address}:${address.port}`);
		});

		server.on('message', (msg, rinfo) => {
			console.log(
				`← Server received: ${msg} from ${rinfo.address}:${rinfo.port}`,
			);
			const data = JSON.parse(msg?.toString());
			if (data?.method == 'RECEIVE' && !isSending) {
				setIsSending(true);
				ackSend(rinfo.address, rinfo.port);
			}
		});

		const ackSend = (_IP: string, _PORT: number) => {
			const msg = {
				method: 'SEND',
				name: 'Mr. Thor',
			};
			// broadcast(server, _IP, _PORT, JSON.stringify(msg));
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

	return (
		<Box flexDirection="column">
			{!isSending && (
				<Text>
					<Spinner /> Sending
				</Text>
			)}
		</Box>
	);
};

export default Sender;
