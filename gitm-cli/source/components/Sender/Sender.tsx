import React, {useCallback, useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import {Spinner} from '../Misc/Spinner.js';
import {useSenderTcpServer} from '../../functions/senderTcpServer.js';
import {useSenderUdpServer} from '../../functions/snederUdpServer.js';

const MY_IP = '192.168.0.105'; // FIXME: FIX Static
const BROADCAST_ADDR = '192.168.0.255'; // FIXME: FIX Static
const MY_UDP_PORT = 9039;
const MY_TCP_PORT = 6969;
const OTHER_UDP_PORT = 9040;
const OTHER_TCP_PORT = 3040;

const Sender = () => {
	const path = process.cwd() + '/send_files'; // FIXME: FIX Static
	const fileName = process.argv[3];
	const filePath = `${path}/${fileName}`;
	console.log('🌆🌇🌉🏞🌃🏙🌄🌅🌁', path);

	const [isSending, setIsSending] = useState(false);

	const sendTcpReceiveRequest = useCallback(
		(_IP: string) => {
			const url = `http://${_IP}:${OTHER_TCP_PORT}/request-to-receive?fileName=${fileName}`;

			fetch(url)
				.then(response => response.json())
				.then(data => {
					console.log(data);
				})
				.catch(error => {
					console.error('Error:', error);
				});
		},
		[OTHER_TCP_PORT, fileName],
	);

	useSenderTcpServer(MY_IP, MY_TCP_PORT, filePath);
	useSenderUdpServer(
		BROADCAST_ADDR,
		MY_UDP_PORT,
		OTHER_UDP_PORT,
		OTHER_TCP_PORT,
		fileName,
		isSending,
		setIsSending,
		sendTcpReceiveRequest,
	);

	return (
		<Box flexDirection="column">
			{isSending && (
				<Text>
					<Spinner /> Sending
				</Text>
			)}
		</Box>
	);
};

export default Sender;
