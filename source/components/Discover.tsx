import React, {useEffect, useState} from 'react';
import {Box, Spacer, Text} from 'ink';
import {Spinner, spinners} from '@/components/Misc/Spinner';
import {useStore} from '@nanostores/react';
import {$action, $baseInfo, $sendingFiles} from '@/stores/baseStore';
import {$connectedPeers} from '@/stores/peersStore';
import {useUdpServer} from '@/functions/udpServer';
import {hasNullValue} from '@/functions/helper';
import PeerList from '@/components/Misc/PeerList';
import {useHttpServer} from '@/functions/httpServer';
import {useActivePeers} from '@/functions/useActivePeers';
import FileTransfer from '@/components/Misc/FileTransfer';
import {
	$currTransfer,
	$peersFiles,
	initTransferInfo,
} from '@/stores/fileHandlerStore';
import {useFileDownloader} from '@/functions/useFileDownloader';
import {useHashCheck} from '@/functions/useHashCheck';
import {log} from '@/functions/log';

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

	const onSelect = (peerID: string) => {
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

		Object.entries(selectedPeerFiles)?.forEach(async ([key, value]) => {
			log(`Downloading: ${value.fileName}`);

			try {
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
			} catch (error) {
				console.error('An error occurred:', error);
			}
		});
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
