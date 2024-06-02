import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import {Spinner} from './Misc/Spinner.js';
import {useStore} from '@nanostores/react';
import {$baseInfo, $users} from '../stores/baseStore.js';
import {useUdpServer} from '../functions/udpServer.js';
import {hasNullValue} from '../functions/helper.js';
import SenderList from './Misc/UserList.js';
import {useHttpServer} from '../functions/httpServer.js';

const Discover = () => {
	const baseInfo = useStore($baseInfo);
	const users = useStore($users);

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

	return (
		<Box flexDirection="column">
			{true && (
				<Text>
					<Spinner /> Discovering
				</Text>
			)}
			{users && <SenderList users={users} />}
		</Box>
	);
};

export default Discover;
