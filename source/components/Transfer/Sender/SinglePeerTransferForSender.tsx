import React, {useEffect, useMemo} from 'react';
import SendArrowAnimation from '@/components/Misc/SendArrowAnimation.js';
import {Box, Text} from 'ink';
import {useStore} from '@nanostores/react';
import {formatBytes} from '@/functions/helper.js';
import ProgressBar from '@/components/Misc/ProgressBar.js';
import {SenderSinglePeerTransferInfo} from '@/types/storeTypes.js';

type PropType = {
	peerTransferInfo: SenderSinglePeerTransferInfo;
};
const SinglePeerTransferForSender = ({peerTransferInfo}: PropType) => {
	const totalProgress = useMemo(() => {
		return Math.min(
			(peerTransferInfo.totalTransferred / peerTransferInfo.totalFileSize) *
				100,
			100,
		);
	}, [peerTransferInfo.totalTransferred, peerTransferInfo.totalFileSize]);

	const isTransferComplete = useMemo(
		() => totalProgress == 100,
		[totalProgress],
	);

	return (
		<Box flexDirection="column">
			<Box flexDirection="column">
				{isTransferComplete ? (
					<Text dimColor={true}>Files Transfer Complete 🎉</Text>
				) : (
					<Text>
						SENDING⠀
						<SendArrowAnimation />
					</Text>
				)}
				<Box>
					<ProgressBar left={0} percent={totalProgress ?? 0} />
					<Text dimColor={true}>
						⠀({formatBytes(peerTransferInfo.totalTransferred)}⠀/⠀
						{formatBytes(peerTransferInfo.totalFileSize)})
					</Text>
				</Box>
			</Box>

			{/* <Box
				borderColor="green"
				borderStyle="bold"
				paddingX={1}
				flexDirection="column"
				marginTop={1}
			>
				<Box flexDirection="column">
					<Text backgroundColor="green" color="white" bold>
						{' '}
						{currTransfer.peerInfo.peerName}{' '}
					</Text>
				</Box>

				<Text dimColor={true}>
					⠀({formatBytes(receiverTotalDownload)}⠀/⠀
					{formatBytes(currTransfer.totalFileSize)})
				</Text>
			</Box> */}
		</Box>
	);
};

export default SinglePeerTransferForSender;
