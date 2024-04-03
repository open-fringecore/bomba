import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import SenderList from '../Misc/SenderList.js';
import {Spinner} from '../Misc/Spinner.js';
import useBroadcast from '../../functions/broadcast.js';
import {useSenderTcpServer} from '../../functions/senderTcpServer.js';
import {useSenderUdpServer} from '../../functions/snederUdpServer.js';

const MY_IP = '192.168.0.105'; // FIXME: FIX Static
const MY_PORT = 9039;
const MY_TCP_PORT = 6969;
const OTHER_TCP_PORT = 3040;

const Sender = () => {
	const path = process.cwd() + '/send_files'; // FIXME: FIX Static
	const fileName = process.argv[3];
	const filePath = `${path}/${fileName}`;
	console.log('🌆🌇🌉🏞🌃🏙🌄🌅🌁', path);

	const [isSending, setIsSending] = useState(false);

	const {broadcast} = useBroadcast();
	useSenderTcpServer(MY_IP, MY_TCP_PORT, filePath);
	useSenderUdpServer(
		MY_PORT,
		OTHER_TCP_PORT,
		fileName,
		isSending,
		setIsSending,
	);

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
