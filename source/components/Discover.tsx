import React from 'react';
import {Box, Text} from 'ink';
import {useStore} from '@nanostores/react';
import {$baseInfo} from '@/stores/baseStore.js';
import {$connectedPeers} from '@/stores/peersStore.js';
import PeerList from '@/components/PeerList.js';
import {
	$peersFiles,
	initReceiverTransferInfo,
} from '@/stores/receiverfileHandlerStore.js';
import {log} from '@/functions/log.js';
import {fetchInitSenderTransfer} from '@/functions/fetch.js';
import WaveAnimation from '@/components/Misc/WaveAnimation.js';

const Discover = () => {
	const baseInfo = useStore($baseInfo);
	const connectedPeers = useStore($connectedPeers);
	const peersFiles = useStore($peersFiles);

	if (
		!baseInfo.MY_NAME ||
		!baseInfo.BROADCAST_ADDR ||
		!baseInfo.MY_IP ||
		!baseInfo.UDP_PORT
	) {
		throw new Error('Base Info Data not set properly');
	}

	const onSelect = async (peerID: string) => {
		const selectedPeer = connectedPeers[peerID];
		const selectedPeerFiles = peersFiles[peerID];

		if (!selectedPeer) {
			log('Selected Peer not found');
			return;
		}
		if (!selectedPeerFiles) {
			log('No sending files found');
			return;
		}

		// ! Notifying Sender that I have started receiving
		const isSenderInitSuccess = await fetchInitSenderTransfer(
			selectedPeer.ip,
			selectedPeer.httpPort,
			baseInfo.MY_ID,
		);
		if (!isSenderInitSuccess) {
			return log('⭕ Sender init transfer failed. ⭕');
		}

		const totalFiles = Object.entries(selectedPeerFiles).length;
		initReceiverTransferInfo(
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
