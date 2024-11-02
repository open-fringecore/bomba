import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import Discover from '@/components/Discover.js';
import {useStore} from '@nanostores/react';
import {$action, $baseInfo, $sendingFiles} from '@/stores/baseStore.js';
import {$receiverTransferInfo} from '@/stores/receiverfileHandlerStore.js';
import ReceiverFileTransfer from '@/components/Transfer/Receiver/ReceiverFileTransfer.js';
import SenderFileTransfer from '@/components/Transfer/Sender/SenderFileTransfer.js';
import {useUdpServer} from '@/functions/udpServer.js';
import {useHttpServer} from '@/functions/httpServer.js';
import {isObjectEmpty} from '@/functions/helper.js';
import {$senderTransferInfo} from '@/stores/senderFileHandlerStore.js';
import {useActivePeers} from '@/functions/useActivePeers.js';

type TProps = {};

export default function MainApp({}: TProps) {
	const baseInfo = useStore($baseInfo);
	const action = useStore($action);
	const receiverTransferInfo = useStore($receiverTransferInfo);
	const senderTransferInfo = useStore($senderTransferInfo);
	const sendingFiles = useStore($sendingFiles);

	if (
		!baseInfo.MY_NAME ||
		!baseInfo.BROADCAST_ADDR ||
		!baseInfo.MY_IP ||
		!baseInfo.UDP_PORT
	) {
		throw new Error('Base Info Data not set properly');
	}

	useUdpServer(
		baseInfo.MY_ID,
		baseInfo.MY_NAME,
		baseInfo.BROADCAST_ADDR,
		baseInfo.MY_IP,
		baseInfo.UDP_PORT,
		baseInfo.HTTP_PORT,
	);

	useHttpServer(
		baseInfo.MY_IP,
		baseInfo.HTTP_PORT,
		action == 'SEND',
		sendingFiles,
	);

	useActivePeers();

	const isTransferring =
		!isObjectEmpty(receiverTransferInfo) || !isObjectEmpty(senderTransferInfo);

	return (
		<Box flexDirection="column">
			{isTransferring ? (
				action == 'SEND' ? (
					<SenderFileTransfer />
				) : (
					<ReceiverFileTransfer />
				)
			) : (
				<Discover />
			)}
		</Box>
	);
}
