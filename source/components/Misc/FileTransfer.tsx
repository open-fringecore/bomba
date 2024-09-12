import React, {useMemo, useState} from 'react';
import {Box, Text} from 'ink';
import {log, logToFile} from '@/functions/log.js';
import SingleFileTransfer from '@/components/Misc/SingleFileTransfer.js';
import {findLongestString} from '@/functions/helper.js';
import {CurrTransfer} from '@/types/storeTypes.js';

type TProps = {
	currTransfer: CurrTransfer;
};
const FileTransfer = ({currTransfer}: TProps) => {
	const files = currTransfer.files;
	const totalFiles = Object.keys(files)?.length;

	const [downloadIndex, setDownloadIndex] = useState(0);
	const [isStartedTransferring, setIsStartedTransferring] = useState(false);
	const [isTransferComplete, setIsTransferComplete] = useState(false);

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

	const onSingleDownloadComplete = () => {
		if (downloadIndex >= totalFiles - 1) {
			setIsTransferComplete(true);
			log('💯 Dowload Complete 💯');
		} else {
			setDownloadIndex(prevIndex => prevIndex + 1);
		}
	};

	const longestNameLength = useMemo(() => {
		const longestLength =
			findLongestString(Object.values(files).map(file => file.fileName))
				?.length ?? Infinity;
		return Math.min(longestLength, 30);
	}, [files]);

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
					progress={files[key]?.progress ?? 0}
					state={files[key]?.state!}
					error={files[key]?.errorMsg}
					fileInfo={{
						fileId: key,
						fileName: files[key]?.fileName!,
						fileSize: files[key]?.totalSize!,
					}}
					peerInfo={currTransfer.peerInfo}
					isStartedTransferring={isStartedTransferring}
					setIsStartedTransferring={setIsStartedTransferring}
					isTransferComplete={isTransferComplete}
					onSingleDownloadComplete={onSingleDownloadComplete}
					longestNameLength={longestNameLength}
				/>
			))}
		</Box>
	);
};

export default FileTransfer;
