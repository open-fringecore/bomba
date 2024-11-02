import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Box, Text, useApp} from 'ink';
import {log} from '@/functions/log.js';
import SingleFileTransferForReceiver from '@/components/Transfer/Receiver/SingleFileTransferForReceiver.js';
import {findLongestString, formatBytes} from '@/functions/helper.js';
import {CurrTransfer} from '@/types/storeTypes.js';
import {useStore} from '@nanostores/react';
import {$currTransfer} from '@/stores/receiverfileHandlerStore.js';
import {$baseInfo} from '@/stores/baseStore.js';

type TProps = {};
const FileTransferForReceiver = ({}: TProps) => {
	const currTransfer = useStore($currTransfer);

	const [downloadIndex, setDownloadIndex] = useState(-1);
	const [isStartedTransferring, setIsStartedTransferring] = useState(false);
	const [isTransferComplete, setIsTransferComplete] = useState(false);

	const totalFiles = Object.keys(currTransfer.files)?.length;

	const endTransfer = async () => {
		setIsTransferComplete(true);
		log('💯 Download Complete 💯');
		process.exit(0);
	};

	const onSingleDownloadComplete = useCallback(() => {
		if (downloadIndex >= totalFiles - 1) {
			endTransfer();
		} else {
			setDownloadIndex(prevIndex => prevIndex + 1);
		}
	}, [totalFiles, downloadIndex]);

	const longestNameLength = useMemo(() => {
		const longestLength =
			findLongestString(
				Object.values(currTransfer.files).map(file => file.fileName),
			)?.length ?? Infinity;
		return Math.min(longestLength, 30);
	}, [currTransfer.files]);

	const sumTotalTransferred = useMemo(
		() =>
			Object.values(currTransfer.files).reduce(
				(sum, file) => sum + file.totalTransferred,
				0,
			),
		[JSON.stringify(currTransfer.files)],
	);

	useEffect(() => {
		if (!isStartedTransferring && !isTransferComplete) {
			setIsStartedTransferring(true);
			setDownloadIndex(0);
		}
	}, [isStartedTransferring, isTransferComplete]);

	return (
		<Box
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
				{isTransferComplete
					? 'Files Transfer Complete 🎉'
					: isStartedTransferring
					? 'Receiving Files...'
					: 'Files'}
				⠀({formatBytes(sumTotalTransferred)}⠀/⠀
				{formatBytes(currTransfer.totalFileSize)})
			</Text>

			{Object.entries(currTransfer.files).map(([key, value], index) => (
				<SingleFileTransferForReceiver
					key={key}
					index={index}
					downloadIndex={downloadIndex}
					fileId={key}
					file={value}
					peerInfo={currTransfer.peerInfo}
					isStartedTransferring={isStartedTransferring}
					isTransferComplete={isTransferComplete}
					onSingleDownloadComplete={onSingleDownloadComplete}
					longestNameLength={longestNameLength}
				/>
			))}
		</Box>
	);
};

export default FileTransferForReceiver;
