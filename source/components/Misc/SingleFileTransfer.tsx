import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import ProgressBar from '@/components/Misc/ProgressBar.js';
import CustomTask from '@/components/Misc/CustomTask.js';
import {
	CurrTransferPeerInfo,
	SingleFile,
	TransferStates,
} from '@/stores/fileHandlerStore.js';
import {logToFile} from '@/functions/log.js';
import {performSingleDownloadSteps} from '@/functions/useFileDownloader.js';

export type TaskStates = {
	[key: string]: 'pending' | 'success' | 'error' | 'success' | 'loading';
};

type PropType = {
	progress: number;
	state: TransferStates;
	error?: string;
	fileInfo: SingleFile;
	peerInfo: CurrTransferPeerInfo;
	isStartedTransferring: boolean;
	isTransferComplete: boolean;
};
const SingleFileTransfer = ({
	progress,
	state,
	error,
	fileInfo,
	peerInfo,
	isStartedTransferring,
	isTransferComplete,
}: PropType) => {
	const taskState: TaskStates = {
		DEFAULT: 'pending',
		TRANSFERRING: 'loading',
		TRANSFERRED: 'loading',
		ERROR: 'error',
		SUCCESS: 'success',
	};

	const startDownload = async () => {
		await performSingleDownloadSteps(
			fileInfo.fileId,
			fileInfo.fileName,
			fileInfo.fileSize,
			{
				peerIP: peerInfo.peerIP,
				peerID: peerInfo.peerID,
				peerHttpPort: peerInfo.peerHttpPort,
				senderName: peerInfo.senderName,
			},
		);
	};

	useEffect(() => {
		logToFile('Render: ' + fileInfo.fileName);
		startDownload();
	}, []);

	return (
		<Box>
			{isStartedTransferring && !isTransferComplete && (
				<ProgressBar left={1} percent={progress} />
			)}
			{/* <Task
				label={fileName ?? ''}
				state={taskState[state]}
				spinner={cliSpinners.dots}
			/> */}
			<CustomTask label={`⠀${fileInfo.fileName}`} state={taskState[state]} />
			{error && <Text color={'red'}>⠀{error}</Text>}
		</Box>
	);
};

export default SingleFileTransfer;
