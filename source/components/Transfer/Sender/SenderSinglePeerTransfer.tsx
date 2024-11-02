import React, {useMemo} from 'react';
import SendArrowAnimation from '@/components/Misc/SendArrowAnimation.js';
import {Box, Text} from 'ink';
import {findLongestString, formatBytes} from '@/functions/helper.js';
import {SenderSinglePeerTransferInfo} from '@/types/storeTypes.js';
import SingleFileTransfer from '@/components/Transfer/SingleFileTransfer.js';

type PropType = {
	peerTransferInfo: SenderSinglePeerTransferInfo;
};

const SenderSinglePeerTransfer = ({peerTransferInfo}: PropType) => {
	const longestNameLength = useMemo(() => {
		const longestLength =
			findLongestString(
				Object.values(peerTransferInfo.files).map(file => file.fileName),
			)?.length ?? Infinity;
		return Math.min(longestLength, 30);
	}, [peerTransferInfo.files]);

	const sumTotalTransferred = useMemo(
		() =>
			Object.values(peerTransferInfo.files).reduce(
				(sum, file) => sum + file.totalTransferred,
				0,
			),
		[JSON.stringify(peerTransferInfo.files)],
	);

	const overallState = useMemo(() => {
		const fileStates = Object.values(peerTransferInfo.files).map(
			file => file.state,
		);
		if (fileStates.includes('ERROR')) {
			return 'FAILED';
		}

		return fileStates.every(state => state === 'SUCCESS')
			? 'COMPLETE'
			: 'IN_PROGRESS';
	}, [JSON.stringify(peerTransferInfo.files)]);

	const stateMessageComponent = {
		IN_PROGRESS: <Text dimColor={true}>Sending Files...</Text>,
		COMPLETE: <Text dimColor={true}>Files Transfer Complete 🎉</Text>,
		FAILED: (
			<Text dimColor={true} color={'red'}>
				Transfer Failed ✘
			</Text>
		),
	};

	return (
		<Box
			borderColor="#A855F7"
			borderStyle="bold"
			paddingX={1}
			flexDirection="column"
			marginTop={1}
		>
			<Box>
				<Text backgroundColor="#A855F7" color="white" bold>
					⠀{peerTransferInfo.peerInfo.peerName}⠀
				</Text>
				{overallState == 'IN_PROGRESS' && <SendArrowAnimation />}
			</Box>

			<Box>
				{stateMessageComponent[overallState]}
				<Text dimColor={true}>
					⠀({formatBytes(sumTotalTransferred)}⠀/⠀
					{formatBytes(peerTransferInfo.totalFileSize)})
				</Text>
			</Box>

			{Object.entries(peerTransferInfo.files).map(([key, value]) => (
				<SingleFileTransfer
					key={key}
					file={value}
					longestNameLength={longestNameLength}
				/>
			))}
		</Box>
	);
};

export default SenderSinglePeerTransfer;
