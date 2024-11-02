import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import Discover from '@/components/Discover.js';
import {useStore} from '@nanostores/react';
import {$action, $baseInfo, $sendingFiles} from '@/stores/baseStore.js';
import {$currTransfer} from '@/stores/receiverfileHandlerStore.js';
import FileTransferForReceiver from '@/components/Transfer/Receiver/FileTransferForReceiver.js';
import FileTransferForSender from '@/components/Transfer/Sender/FileTransferForSender.js';
import {useUdpServer} from '@/functions/udpServer.js';
import {useHttpServer} from '@/functions/httpServer.js';
import {isObjectEmpty} from '@/functions/helper.js';
import {$senderTransferInfo} from '@/stores/senderFileHandlerStore.js';
import {useActivePeers} from '@/functions/useActivePeers.js';

type TProps = {};

export default function MainApp({}: TProps) {
	const baseInfo = useStore($baseInfo);
	const action = useStore($action);
	const currTransfer = useStore($currTransfer);
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
		!isObjectEmpty(currTransfer) || !isObjectEmpty(senderTransferInfo);

	return (
		<Box flexDirection="column">
			{isTransferring ? (
				action == 'SEND' ? (
					<FileTransferForSender />
				) : (
					<FileTransferForReceiver />
				)
			) : (
				<Discover />
			)}
		</Box>
	);
}
