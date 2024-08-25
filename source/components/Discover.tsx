import React from 'react';
import {Box, Spacer, Text} from 'ink';
import {Spinner, spinners} from '@/components/Misc/Spinner.js';
import {useStore} from '@nanostores/react';
import {
	$action,
	$baseInfo,
	$sendingFiles,
	SingleSendingFile,
} from '@/stores/baseStore.js';
import {$connectedPeers, ConnectedPeerType} from '@/stores/peersStore.js';
import {useUdpServer} from '@/functions/udpServer.js';
import {hasNullValue} from '@/functions/helper.js';
import PeerList from '@/components/Misc/PeerList.js';
import {useHttpServer} from '@/functions/httpServer.js';
import {useActivePeers} from '@/functions/useActivePeers.js';
import FileTransfer from '@/components/Misc/FileTransfer.js';
import {
	$currTransfer,
	$peersFiles,
	initTransferInfo,
	SingleTransferFileInfo,
} from '@/stores/fileHandlerStore.js';
import {useFileDownloader} from '@/functions/useFileDownloader.js';
import {useHashCheck} from '@/functions/useHashCheck.js';
import {log} from '@/functions/log.js';

const Discover = () => {
	const action = useStore($action);
	const baseInfo = useStore($baseInfo);
	const connectedPeers = useStore($connectedPeers);
	const sendingFiles = useStore($sendingFiles);
	const peersFiles = useStore($peersFiles);
	const currTransfer = useStore($currTransfer);

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

	const downloadSingleFile = async (
		key: string,
		value: SingleSendingFile,
		selectedPeer: ConnectedPeerType,
	) => {
		await useFileDownloader(
			selectedPeer.id,
			selectedPeer.ip,
			selectedPeer.httpPort,
			key,
			value.fileName,
		);
		await useHashCheck(
			selectedPeer.id,
			selectedPeer.ip,
			selectedPeer.httpPort,
			key,
			value.fileName,
		);
	};

	const onSelect = async (peerID: string) => {
		const selectedPeer = connectedPeers[peerID];
		const selectedPeerFiles = peersFiles[peerID];

		if (!selectedPeer) {
			log('Selected Peer not found');
			return;
		}
		if (!selectedPeerFiles) {
			log('⭕ No sending files found ⭕');
			return;
		}

		const totalFiles = Object.entries(selectedPeerFiles).length;
		initTransferInfo(peerID, selectedPeer.name, totalFiles, selectedPeerFiles);

		for (const [key, value] of Object.entries(selectedPeerFiles)) {
			log(`Downloading: ${value.fileName}`);

			try {
				await downloadSingleFile(key, value, selectedPeer);
			} catch (error) {
				console.error('An error occurred:', error);
			}
		}
	};

	return (
		<Box flexDirection="column">
			{!currTransfer?.files ? (
				<Text>
					<Spinner frames={spinners.dotsRound} color="magenta" />{' '}
					{action == 'SEND' ? 'Sending' : 'Receiving'}
				</Text>
			) : (
				<></>
			)}

			{currTransfer?.files ? (
				<FileTransfer currTransfer={currTransfer} />
			) : connectedPeers ? (
				<PeerList peers={connectedPeers} onSelect={onSelect} />
			) : (
				<></>
			)}
		</Box>
	);
};

export default Discover;
