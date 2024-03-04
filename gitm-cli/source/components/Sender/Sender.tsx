import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import SenderList from '../Misc/SenderList.js';
import {Spinner} from '../Misc/Spinner.js';
import dgram from 'dgram';
import useBroadcast from '../../functions/broadcast.js';
import {useFileDownloadServer} from '../../functions/useFileDownloadServer.js';

const MY_IP = '192.168.68.204';
const MY_PORT = 9039;
const MY_TCP_PORT = 6969;
const OTHER_TCP_PORT = 3040;

const Sender = () => {
	const path = '/home/rifat/Works/gitm/gitm-cli/send_files' || process.cwd(); // FIXME: FIX Static
	const fileName = process.argv[3];
	const filePath = `${path}/${fileName}`;

	const [isSending, setIsSending] = useState(false);
	const [isHttpStarted, setIsHttpServerStarted] = useState(false);

	const {broadcast} = useBroadcast();

	useEffect(() => {
		if (!isHttpStarted) {
			useFileDownloadServer(MY_IP, MY_TCP_PORT, filePath);
			setIsHttpServerStarted(true);
		}
	}, [isHttpStarted]);

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
				ackSend(rinfo.address, rinfo.port);
			}
		});

		const ackSend = (_IP: string, _PORT: number) => {
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
