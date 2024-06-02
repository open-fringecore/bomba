import React, {useCallback, useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import {Spinner} from './Misc/Spinner.js';
import {useStore} from '@nanostores/react';
import {$baseInfo, $users} from '../stores/baseStore.js';
import {useUdpServer} from '../functions/udpServer.js';
import {hasNullValue} from '../functions/helper.js';
import SenderList from './Misc/UserList.js';
// import {useHttpServer} from '../functions/httpServer.js';

const Discover = () => {
	const baseInfo = useStore($baseInfo);
	const discoveredPeers = useStore($users);

	const connectedPeers = useState<
		{
			ip: string;
			name: string;
			isSending: boolean;
			sendFilename: string;
			httpPort: number;
		}[]
	>([]);

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

	// useHttpServer(baseInfo.MY_IP, baseInfo.HTTP_PORT);

	useEffect(() => {
		// for every peer,
		// create websocket connection
		// if websocket connection already exists, don't create nerw connection
		// if websocket connected add to servers list.
		// if websocket disconnected remove from servers lsit.
		// if websocket didn't dconnect don't add to servers list.
	}, [discoveredPeers]);

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
