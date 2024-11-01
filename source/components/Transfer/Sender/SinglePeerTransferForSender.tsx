import React, {useEffect, useMemo} from 'react';
import SendArrowAnimation from '@/components/Misc/SendArrowAnimation.js';
import {Box, Text} from 'ink';
import {useStore} from '@nanostores/react';
import {findLongestString, formatBytes} from '@/functions/helper.js';
import ProgressBar from '@/components/Misc/ProgressBar.js';
import {SenderSinglePeerTransferInfo} from '@/types/storeTypes.js';
import SingleFileTransferForSender from '@/components/Transfer/Sender/SingleFileTransferForSender.js';

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

	const defaultComponent = <Text dimColor={true}>Sending Files...</Text>;
	const stateWiseComponent = {
		DEFAULT: defaultComponent,
		TRANSFERRING: defaultComponent,
		TRANSFERRED: defaultComponent,
		HASH_CHECKING: <Text dimColor={true}>Hash Checking...</Text>,
		SUCCESS: <Text dimColor={true}>Files Transfer Complete 🎉</Text>,
		ERROR: (
			<Text color={'red'}>
				{peerTransferInfo.errorMsg ?? 'Transfer Failed'} 😥
			</Text>
		),
	};

	const longestNameLength = useMemo(() => {
		const longestLength =
			findLongestString(
				Object.values(peerTransferInfo.files).map(file => file.fileName),
			)?.length ?? Infinity;
		return Math.min(longestLength, 30);
	}, [peerTransferInfo.files]);

	return (
		<Box
			borderColor="green"
			borderStyle="bold"
			paddingX={1}
			flexDirection="column"
			marginTop={1}
		>
			<Box>
				<Text backgroundColor="green" color="white" bold>
					{' '}
					{peerTransferInfo.peerInfo.peerName}{' '}
				</Text>
				{['TRANSFERRING', 'TRANSFERRED'].includes(peerTransferInfo.state) && (
					<SendArrowAnimation />
				)}
			</Box>

			<Box>
				{stateWiseComponent[peerTransferInfo.state]}
				<Text dimColor={true}>
					⠀({formatBytes(peerTransferInfo.totalTransferred)}⠀/⠀
					{formatBytes(peerTransferInfo.totalFileSize)})
				</Text>
			</Box>

			{Object.entries(peerTransferInfo.files).map(([key, value]) => (
				<SingleFileTransferForSender
					key={key}
					file={value}
					longestNameLength={longestNameLength}
				/>
			))}
		</Box>
	);
};

export default SinglePeerTransferForSender;
