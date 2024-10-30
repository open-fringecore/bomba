import React from 'react';
import {Box, Text} from 'ink';
import Discover from '@/components/Discover.js';
import {useStore} from '@nanostores/react';
import {$action, $baseInfo} from '@/stores/baseStore.js';
import {$currTransfer} from '@/stores/fileHandlerStore.js';
import FileTransfer from '@/components/FileTransfer.js';
import FileTransferForSender from '@/components/FileTransferForSender.js';

type TProps = {};

export default function MainApp({}: TProps) {
	const baseInfo = useStore($baseInfo);
	const action = useStore($action);
	const currTransfer = useStore($currTransfer);

	return (
		<Box flexDirection="column">
			{currTransfer?.files ? (
				action == 'SEND' ? (
					<FileTransferForSender />
				) : (
					<FileTransfer />
				)
			) : (
				<Discover />
			)}
		</Box>
	);
}
