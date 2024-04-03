import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import {Spinner} from '../Misc/Spinner.js';
import {useReceiverTcpServer} from '../../functions/receiverTcpServer.js';
import {useReceiverUdpServer} from '../../functions/receiverUdpServer.js';
import SenderList from '../Misc/SenderList.js';

const MY_IP = '192.168.0.105'; // FIXME: FIX Static
const BROADCAST_ADDR = '192.168.0.255'; // FIXME: FIX Static
const MY_UDP_PORT = 9040;
const MY_TCP_PORT = 3040;
const OTHER_UDP_PORT = 9039;
const OTHER_TCP_PORT = 6969;

export type SenderType = {
	name: string;
	ip: string;
	fileName: string;
};
export type SendersType = SenderType[] | null;

const Receiver = () => {
	const [isReceiving, setIsReceiving] = useState(false);
	const [senders, setSenders] = useState<SendersType>([
		{
			name: 'Whatever',
			ip: '99999',
			fileName: 'anything',
		},
		{
			name: 'Whatever 2',
			ip: '99999',
			fileName: 'anything',
		},
	]);

	useReceiverTcpServer(MY_IP, MY_TCP_PORT, OTHER_TCP_PORT);
	useReceiverUdpServer(
		BROADCAST_ADDR,
		MY_UDP_PORT,
		OTHER_UDP_PORT,
		OTHER_TCP_PORT,
		isReceiving,
		setIsReceiving,
		senders,
		setSenders,
	);

	return (
		<Box flexDirection="column">
			{isReceiving && (
				<Text>
					<Spinner /> Receiving
				</Text>
			)}
			{senders && <SenderList senders={senders} />}
		</Box>
	);
};

export default Receiver;
