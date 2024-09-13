import React, {useEffect, useMemo, useCallback} from 'react';
import {Box, Text} from 'ink';
import ProgressBar from '@/components/Misc/ProgressBar.js';
import CustomTask from '@/components/Misc/CustomTask.js';
import {logError} from '@/functions/log.js';
import {
	checkEnoughSpace,
	useFileDownloader,
} from '@/functions/useFileDownloader.js';
import {useHashCheck} from '@/functions/useHashCheck.js';
import {adjustStringLength, formatBytes} from '@/functions/helper.js';
import {
	CurrTransferPeerInfo,
	SingleFile,
	TransferStates,
} from '@/types/storeTypes.js';

type TaskStatus = 'pending' | 'success' | 'error' | 'loading';
export type TaskStates = Record<TransferStates, TaskStatus>;

type TProps = {
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

const SingleFileTransfer: React.FC<TProps> = ({
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
}) => {
	const taskState: TaskStates = {
		DEFAULT: 'pending',
		TRANSFERRING: 'loading',
		TRANSFERRED: 'loading',
		ERROR: 'error',
		SUCCESS: 'success',
	};

	const startDownload = useCallback(async () => {
		try {
			const {fileId, fileName, fileSize} = fileInfo;
			const {peerIP, peerHttpPort} = peerInfo;

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
	}, [
		fileInfo,
		peerInfo,
		isStartedTransferring,
		setIsStartedTransferring,
		onSingleDownloadComplete,
	]);

	useEffect(() => {
		if (downloadIndex === index) {
			startDownload();
		}
	}, [downloadIndex, index, startDownload]);

	const label = useMemo(() => {
		const fileName = adjustStringLength(fileInfo.fileName, longestNameLength);
		const formattedSize = formatBytes(fileInfo.fileSize);
		return `⠀${fileName} - ${formattedSize}`;
	}, [fileInfo, longestNameLength]);

	return (
		<Box>
			{isStartedTransferring && !isTransferComplete && (
				<ProgressBar left={1} percent={progress} />
			)}
			<CustomTask label={label} state={taskState[state]} />
			{error && <Text color="red">⠀{error}</Text>}
		</Box>
	);
};

export default SingleFileTransfer;
