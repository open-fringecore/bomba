import React, {useEffect, useMemo} from 'react';
import SendArrowAnimation from '@/components/Misc/SendArrowAnimation.js';
import {Box, Text} from 'ink';
import {useStore} from '@nanostores/react';
import {formatBytes} from '@/functions/helper.js';
import ProgressBar from '@/components/Misc/ProgressBar.js';
import {$senderTransferInfo} from '@/stores/senderFileHandlerStore.js';
import SinglePeerTransferForSender from '@/components/Transfer/Sender/SinglePeerTransferForSender.js';

const FileTransferForSender = () => {
	const senderTransferInfo = useStore($senderTransferInfo);

	return (
		<Box flexDirection="column">
			{Object.entries(senderTransferInfo).map(([key, value]) => (
				<SinglePeerTransferForSender key={key} peerTransferInfo={value} />
			))}
		</Box>
	);
};

export default FileTransferForSender;
