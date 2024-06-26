import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import {Spinner} from './Misc/Spinner.js';
import {useStore} from '@nanostores/react';
import {$action, $baseInfo, $sendingFiles} from '../stores/baseStore.js';
import {$connectedPeers} from '../stores/peersStore.js';
import {useUdpServer} from '../functions/udpServer.js';
import {hasNullValue} from '../functions/helper.js';
import PeerList from './Misc/PeerList.js';
import {useHttpServer} from '../functions/httpServer.js';
import {useActivePeers} from '../functions/useActivePeers.js';

const Discover = () => {
	const baseInfo = useStore($baseInfo);
	const connectedPeers = useStore($connectedPeers);
	const action = useStore($action);
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

	return (
		<Box flexDirection="column">
			<Text>
				<Spinner /> {action == 'SEND' ? 'Sending' : 'Receiving'}
			</Text>
			{connectedPeers && <PeerList peers={connectedPeers} />}
		</Box>
	);
};

export default Discover;
