import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import {Spinner} from '../Misc/Spinner.js';
import {useReceiverTcpServer} from '../../functions/receiverTcpServer.js';
import {useReceiverUdpServer} from '../../functions/receiverUdpServer.js';
import SenderList from '../Misc/SenderList.js';
import {useStore} from '@nanostores/react';
import {$receiverInfo} from '../../stores/receiverStore.js';

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

	const receiverInfo = useStore($receiverInfo);

	useReceiverTcpServer(
		receiverInfo.MY_IP,
		receiverInfo.MY_TCP_PORT,
		receiverInfo.OTHER_TCP_PORT,
	);
	useReceiverUdpServer(
		receiverInfo.BROADCAST_ADDR,
		receiverInfo.MY_UDP_PORT,
		receiverInfo.OTHER_UDP_PORT,
		receiverInfo.OTHER_TCP_PORT,
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
