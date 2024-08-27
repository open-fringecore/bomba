import React, {useEffect, useMemo} from 'react';
import {Box, Text} from 'ink';
import ProgressBar from '@/components/Misc/ProgressBar.js';
import CustomTask from '@/components/Misc/CustomTask.js';
import {
	CurrTransferPeerInfo,
	SingleFile,
	TransferStates,
} from '@/stores/fileHandlerStore.js';
import {logError, logToFile} from '@/functions/log.js';
import {
	checkDuplication,
	checkEnoughSpace,
	performSingleDownloadSteps,
	useFileDownloader,
} from '@/functions/useFileDownloader.js';
import {useHashCheck} from '@/functions/useHashCheck.js';
import {adjustStringLength, formatBytes} from '@/functions/helper.js';

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
	setIsStartedTransferring: (x: boolean) => void;
	isTransferComplete: boolean;
	onSingleDownloadComplete: () => void;
	longestNameLength: number;
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
	setIsStartedTransferring,
	isTransferComplete,
	onSingleDownloadComplete,
	longestNameLength,
}: PropType) => {
	const taskState: TaskStates = {
		DEFAULT: 'pending',
		TRANSFERRING: 'loading',
		TRANSFERRED: 'loading',
		ERROR: 'error',
		SUCCESS: 'success',
	};

	const startDownload = async () => {
		try {
			const {fileId, fileName, fileSize} = fileInfo;
			const {peerIP, peerID, peerHttpPort, senderName} = peerInfo;

			if (!isStartedTransferring) setIsStartedTransferring(true);

			// const isNoDuplicationIssue = await checkDuplication(fileId, fileName);
			// if (!isNoDuplicationIssue) return;

			const isNoSpaceIssue = await checkEnoughSpace(fileId, fileSize);
			if (!isNoSpaceIssue) return;

			await useFileDownloader(peerIP, peerHttpPort, fileId, fileName);
			await useHashCheck(peerIP, peerHttpPort, fileId, fileName);
		} catch (error) {
			logError(error);
		} finally {
			onSingleDownloadComplete();
		}
	};

	useEffect(() => {
		if (downloadIndex == index) {
			startDownload();
		}
	}, [downloadIndex]);

	const label = useMemo(() => {
		const fileName = adjustStringLength(fileInfo.fileName, longestNameLength);
		const formattedSize = formatBytes(fileInfo.fileSize);
		return `⠀${fileName} - ${formattedSize}`;
	}, [fileInfo]);

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
			<CustomTask label={label} state={taskState[state]} />
			{error && <Text color={'red'}>⠀{error}</Text>}
		</Box>
	);
};

export default SingleFileTransfer;
