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
import {
	checkDuplication,
	checkEnoughSpace,
	performSingleDownloadSteps,
	useFileDownloader,
} from '@/functions/useFileDownloader.js';
import {useHashCheck} from '@/functions/useHashCheck.js';

export type TaskStates = {
	[key: string]: 'pending' | 'success' | 'error' | 'success' | 'loading';
};

type PropType = {
	index: number;
	downloadIndex: number;
	progress: number;
	state: TransferStates;
	error?: string;
	fileInfo: SingleFile;
	peerInfo: CurrTransferPeerInfo;
	isStartedTransferring: boolean;
	isTransferComplete: boolean;
	onSingleDownloadComplete: () => void;
};
const SingleFileTransfer = ({
	index,
	downloadIndex,
	progress,
	state,
	error,
	fileInfo,
	peerInfo,
	isStartedTransferring,
	isTransferComplete,
	onSingleDownloadComplete,
}: PropType) => {
	const taskState: TaskStates = {
		DEFAULT: 'pending',
		TRANSFERRING: 'loading',
		TRANSFERRED: 'loading',
		ERROR: 'error',
		SUCCESS: 'success',
	};

	const startDownload = async () => {
		const {fileId, fileName, fileSize} = fileInfo;
		const {peerIP, peerID, peerHttpPort, senderName} = peerInfo;

		// const isNoDuplicationIssue = await checkDuplication(fileId, fileName);
		// if (!isNoDuplicationIssue) return;

		const isNoSpaceIssue = await checkEnoughSpace(fileId, fileSize);
		if (!isNoSpaceIssue) return;

		await useFileDownloader(peerIP, peerHttpPort, fileId, fileName);
		await useHashCheck(peerIP, peerHttpPort, fileId, fileName);

		onSingleDownloadComplete();
	};

	useEffect(() => {
		if (downloadIndex == index) {
			logToFile('Render: ' + fileInfo.fileName);
			startDownload();
		}
	}, [downloadIndex]);

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
