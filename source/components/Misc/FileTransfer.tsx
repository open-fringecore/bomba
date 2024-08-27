import React, {useEffect, useMemo, useState} from 'react';
import {Box, Text} from 'ink';
import {CurrTransfer} from '@/stores/fileHandlerStore.js';
import {log, logToFile} from '@/functions/log.js';
import SingleFileTransfer from '@/components/Misc/SingleFileTransfer.js';

type PropType = {
	currTransfer: CurrTransfer;
};
const FileTransfer = ({currTransfer}: PropType) => {
	const files = currTransfer.files;
	const totalFiles = Object.keys(files)?.length;

	const [downloadIndex, setDownloadIndex] = useState(0);

	const totalDefault = useMemo(
		() =>
			Object.keys(files)?.reduce((acc, key) => {
				const state = files[key]?.state ?? 'DEFAULT';
				return ['DEFAULT'].includes(state) ? acc + 1 : acc;
			}, 0),
		[files],
	);
	const totalComplete = useMemo(
		() =>
			Object.keys(files)?.reduce((acc, key) => {
				const state = files[key]?.state ?? 'DEFAULT';
				return ['SUCCESS', 'ERROR'].includes(state) ? acc + 1 : acc;
			}, 0),
		[files],
	);
	const isStartedTransferring = totalDefault !== totalFiles;
	const isTransferComplete = totalComplete === totalFiles;

	const onSingleDownloadComplete = () => {
		if (downloadIndex >= totalFiles - 1) {
			log('💯 Dowload Complete 💯');
		} else {
			setDownloadIndex(prevIndex => prevIndex + 1);
		}
	};

	useEffect(() => {
		// log('💯 File Changes Detecting... 💯');
		// logToFile('💯 File Changes Detecting... 💯', files);
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
			<Text dimColor={true}>
				TC: {totalComplete} - TF: {Object.keys(files)?.length}
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
					isTransferComplete={isTransferComplete}
					onSingleDownloadComplete={onSingleDownloadComplete}
				/>
			))}
		</Box>
	);
};

export default FileTransfer;
