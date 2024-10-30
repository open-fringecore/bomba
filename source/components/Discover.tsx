import React from 'react';
import {Box, Spacer, Text} from 'ink';
import {Spinner, spinners} from '@/components/Misc/Spinner.js';
import {useStore} from '@nanostores/react';
import {$action, $baseInfo, $sendingFiles} from '@/stores/baseStore.js';
import {$connectedPeers} from '@/stores/peersStore.js';
import {useUdpServer} from '@/functions/udpServer.js';
import {hasNullValue} from '@/functions/helper.js';
import PeerList from '@/components/PeerList.js';
import {useHttpServer} from '@/functions/httpServer.js';
import {useActivePeers} from '@/functions/useActivePeers.js';
import FileTransfer from '@/components/FileTransfer.js';
import {$peersFiles, initTransferInfo} from '@/stores/fileHandlerStore.js';
import {log, logError} from '@/functions/log.js';
import {initSenderTransfer} from '@/functions/fetch.js';
import WaveAnimation from '@/components/Misc/WaveAnimation.js';
import SendArrowAnimation from '@/components/Misc/SendArrowAnimation.js';

const Discover = () => {
	const action = useStore($action);
	const baseInfo = useStore($baseInfo);
	const connectedPeers = useStore($connectedPeers);
	const sendingFiles = useStore($sendingFiles);
	const peersFiles = useStore($peersFiles);

	if (
		!baseInfo.MY_NAME ||
		!baseInfo.BROADCAST_ADDR ||
		!baseInfo.MY_IP ||
		!baseInfo.UDP_PORT
	) {
		throw new Error('Base Info Data not set properly');
	}

	useActivePeers();

	const onSelect = async (peerID: string) => {
		const selectedPeer = connectedPeers[peerID];
		const selectedPeerFiles = peersFiles[peerID];

		if (!selectedPeer) {
			log('⭕ Selected Peer not found ⭕');
			return;
		}
		if (!selectedPeerFiles) {
			log('⭕ No sending files found ⭕');
			return;
		}

		const isSenderInitSuccess = await initSenderTransfer(
			`http://${selectedPeer.ip}:${selectedPeer.httpPort}`,
			baseInfo.MY_ID,
		);
		if (!isSenderInitSuccess) {
			log('⭕ Sender init transfer failed. ⭕');
			return;
		}

		const totalFiles = Object.entries(selectedPeerFiles).length;
		initTransferInfo(
			{
				peerID: peerID,
				peerIP: selectedPeer.ip,
				peerHttpPort: selectedPeer.httpPort,
				peerName: selectedPeer.name,
			},
			totalFiles,
			selectedPeerFiles,
		);
	};

	return (
		<Box flexDirection="column">
			{/* <Text>
				<Spinner frames={spinners.dotsRound} color="magenta" />{' '}
				{action == 'SEND' ? 'Sending' : 'Receiving'}
			</Text> */}
			<Text>
				<WaveAnimation />
				⠀DISCOVERING⠀
			</Text>
			<PeerList peers={connectedPeers} onSelect={onSelect} />
		</Box>
	);
};

export default Discover;
