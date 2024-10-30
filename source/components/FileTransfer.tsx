import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Box, Text} from 'ink';
import {log, logToFile} from '@/functions/log.js';
import SingleFileTransfer from '@/components/SingleFileTransfer.js';
import {findLongestString} from '@/functions/helper.js';
import {CurrTransfer} from '@/types/storeTypes.js';
import {useStore} from '@nanostores/react';
import {$currTransfer} from '@/stores/fileHandlerStore.js';

type TProps = {};
const FileTransfer = ({}: TProps) => {
	const currTransfer = useStore($currTransfer);

	const [downloadIndex, setDownloadIndex] = useState(-1);
	const [isStartedTransferring, setIsStartedTransferring] = useState(false);
	const [isTransferComplete, setIsTransferComplete] = useState(false);

	const {files} = currTransfer;
	const totalFiles = Object.keys(files)?.length;

	// const totalDefault = useMemo(
	// 	() =>
	// 		Object.keys(files)?.reduce((acc, key) => {
	// 			const state = files[key]?.state ?? 'DEFAULT';
	// 			return ['DEFAULT'].includes(state) ? acc + 1 : acc;
	// 		}, 0),
	// 	[files],
	// );
	// const totalComplete = useMemo(
	// 	() =>
	// 		Object.keys(files)?.reduce((acc, key) => {
	// 			const state = files[key]?.state ?? 'DEFAULT';
	// 			return ['SUCCESS', 'ERROR'].includes(state) ? acc + 1 : acc;
	// 		}, 0),
	// 	[files],
	// );
	// const isStartedTransferring = totalDefault !== totalFiles;
	// const isTransferComplete = totalComplete === totalFiles;

	const onSingleDownloadComplete = useCallback(() => {
		if (downloadIndex >= totalFiles - 1) {
			setIsTransferComplete(true);
			log('💯 Download Complete 💯');
		} else {
			setDownloadIndex(prevIndex => prevIndex + 1);
		}
	}, [totalFiles]);

	const longestNameLength = useMemo(() => {
		const longestLength =
			findLongestString(Object.values(files).map(file => file.fileName))
				?.length ?? Infinity;
		return Math.min(longestLength, 30);
	}, [files]);

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
					{currTransfer.peerInfo.senderName}{' '}
				</Text>
			</Box>

			<Text dimColor={true}>
				{isTransferComplete
					? 'Files Transfer Complete 🎉'
					: isStartedTransferring
					? 'Receiving Files...'
					: 'Files'}
			</Text>
			{Object.keys(files).map((key, index) => (
				<SingleFileTransfer
					key={key}
					index={index}
					downloadIndex={downloadIndex}
					state={files[key]?.state!}
					error={files[key]?.errorMsg}
					fileInfo={{
						fileId: key,
						fileName: files[key]?.fileName!,
						fileType: files[key]?.fileType!,
						fileSize: files[key]?.totalSize!,
					}}
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

export default FileTransfer;
