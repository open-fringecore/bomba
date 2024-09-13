import React, {useEffect, useMemo, useCallback, useRef} from 'react';
import {Box, Text} from 'ink';
import ProgressBar from '@/components/Misc/ProgressBar.js';
import CustomTask from '@/components/Misc/CustomTask.js';
import {logError, logToFile} from '@/functions/log.js';
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
import {useStore} from '@nanostores/react';
import {$currTransferProgress} from '@/stores/fileHandlerStore.js';

type TaskStatus = 'pending' | 'success' | 'error' | 'loading';
export type TaskStates = Record<TransferStates, TaskStatus>;

type TProps = {
	index: number;
	downloadIndex: number;
	state: TransferStates;
	error?: string;
	fileInfo: SingleFile;
	peerInfo: CurrTransferPeerInfo;
	isStartedTransferring: boolean;
	isTransferComplete: boolean;
	onSingleDownloadComplete: () => void;
	longestNameLength: number;
};

const SingleFileTransfer: React.FC<TProps> = ({
	index,
	downloadIndex,
	state,
	error,
	fileInfo,
	peerInfo,
	isStartedTransferring,
	isTransferComplete,
	onSingleDownloadComplete,
	longestNameLength,
}) => {
	const currTransferProgress = useStore($currTransferProgress);

	const downloadAttempted = useRef(false);

	const taskState: TaskStates = {
		DEFAULT: 'pending',
		TRANSFERRING: 'loading',
		TRANSFERRED: 'loading',
		ERROR: 'error',
		SUCCESS: 'success',
	};

	const startDownload = useCallback(async () => {
		try {
			if (downloadAttempted.current) return;
			downloadAttempted.current = true;

			const {fileId, fileName, fileSize} = fileInfo;
			const {peerIP, peerHttpPort} = peerInfo;

			// const isNoDuplicationIssue = await checkDuplication(fileId, fileName);
			// if (!isNoDuplicationIssue) return;

			const isNoSpaceIssue = await checkEnoughSpace(fileId, fileSize);
			if (!isNoSpaceIssue) return;

			await useFileDownloader(peerIP, peerHttpPort, fileId, fileName);
			await useHashCheck(peerIP, peerHttpPort, fileId, fileName);
			onSingleDownloadComplete();
		} catch (error) {
			logError(error);
		}
	}, [fileInfo, peerInfo, onSingleDownloadComplete]);

	useEffect(() => {
		if (downloadIndex === index && !downloadAttempted.current) {
			logToFile('RERENDER RESTING');
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
				<ProgressBar
					left={1}
					percent={currTransferProgress[fileInfo.fileId] ?? 0}
				/>
			)}
			<CustomTask label={label} state={taskState[state]} />
			{error && <Text color="red">⠀{error}</Text>}
		</Box>
	);
};

export default SingleFileTransfer;
