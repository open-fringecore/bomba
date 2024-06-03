import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import {Spinner} from './Misc/Spinner.js';
import {useStore} from '@nanostores/react';
import {$baseInfo, $peers} from '../stores/baseStore.js';
import {useUdpServer} from '../functions/udpServer.js';
import {hasNullValue} from '../functions/helper.js';
import SenderList from './Misc/UserList.js';
import {useHttpServer} from '../functions/httpServer.js';
import {useActivePeers} from '../functions/checkActivePeers.js';

const Discover = () => {
	const baseInfo = useStore($baseInfo);
	const discoveredPeers = useStore($peers);

	if (
		!baseInfo.MY_NAME ||
		!baseInfo.BROADCAST_ADDR ||
		!baseInfo.MY_IP ||
		!baseInfo.UDP_PORT
	) {
		throw new Error('Base Info Data not set properly');
	}

	useUdpServer(
		baseInfo.MY_NAME,
		baseInfo.BROADCAST_ADDR,
		baseInfo.MY_IP,
		baseInfo.UDP_PORT,
		baseInfo.HTTP_PORT,
	);

	useHttpServer(baseInfo.MY_IP, baseInfo.HTTP_PORT);
	useActivePeers();

	return (
		<Box flexDirection="column">
			{true && (
				<Text>
					<Spinner /> Discovering
				</Text>
			)}
			{discoveredPeers && <SenderList users={discoveredPeers} />}
		</Box>
	);
};

export default Discover;
