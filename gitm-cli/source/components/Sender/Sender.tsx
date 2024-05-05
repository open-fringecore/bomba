import React, {useCallback, useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import {Spinner} from '../Misc/Spinner.js';
import {useSenderTcpServer} from '../../functions/senderTcpServer.js';
import {useSenderUdpServer} from '../../functions/snederUdpServer.js';
import {$senderInfo} from '../../stores/senderStore.js';
import {useStore} from '@nanostores/react';

const Sender = () => {
	const path = process.cwd() + '/send_files'; // FIXME: FIX Static
	const fileName = process.argv[3];
	const filePath = `${path}/${fileName}`;
	console.log('🌆🌇🌉🏞🌃🏙🌄🌅🌁', path);

	const senderInfo = useStore($senderInfo);

	const [isSending, setIsSending] = useState(false);

	const sendTcpReceiveRequest = useCallback(
		(_IP: string) => {
			const url = `http://${_IP}:${senderInfo.OTHER_TCP_PORT}/request-to-receive?fileName=${fileName}`;

			fetch(url)
				.then(response => response.json())
				.then(data => {
					console.log(data);
				})
				.catch(error => {
					console.error('Error:', error);
				});
		},
		[senderInfo.OTHER_TCP_PORT, fileName],
	);

	useSenderTcpServer(senderInfo.MY_IP, senderInfo.MY_TCP_PORT, filePath);
	useSenderUdpServer(
		senderInfo.BROADCAST_ADDR,
		senderInfo.MY_UDP_PORT,
		senderInfo.OTHER_UDP_PORT,
		senderInfo.OTHER_TCP_PORT,
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
