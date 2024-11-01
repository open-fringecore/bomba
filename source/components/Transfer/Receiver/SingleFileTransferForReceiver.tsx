import React, {useEffect, useMemo, useCallback, useRef} from 'react';
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
	TransferPeerInfo,
	SingleFile,
	TransferStates,
} from '@/types/storeTypes.js';
import {useStore} from '@nanostores/react';
import {$receiverTransferProgress} from '@/stores/fileHandlerStore.js';
import {$baseInfo} from '@/stores/baseStore.js';

type TaskStatus = 'pending' | 'success' | 'error' | 'loading';
export type TaskStates = Record<TransferStates, TaskStatus>;

type TProps = {
	index: number;
	downloadIndex: number;
	state: TransferStates;
	error?: string;
	fileInfo: SingleFile;
	peerInfo: TransferPeerInfo;
	isStartedTransferring: boolean;
	isTransferComplete: boolean;
	onSingleDownloadComplete: () => void;
	longestNameLength: number;
};

const SingleFileTransferForReceiver: React.FC<TProps> = ({
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
	const receiverTransferProgress = useStore($receiverTransferProgress);
	const baseInfo = useStore($baseInfo);

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

			const {fileId, fileName, fileSize, fileType} = fileInfo;
			const {peerIP, peerHttpPort} = peerInfo;

			// const isNoDuplicationIssue = await checkDuplication(fileId, fileName);
			// if (!isNoDuplicationIssue) return;

			const isNoSpaceIssue = await checkEnoughSpace(fileId, fileSize);
			if (!isNoSpaceIssue) return;

			await useFileDownloader(
				baseInfo.MY_ID,
				peerIP,
				peerHttpPort,
				fileId,
				fileName,
				fileType,
				fileSize,
			);
			await useHashCheck(peerIP, peerHttpPort, fileId, fileName);
			onSingleDownloadComplete();
		} catch (error) {
			logError(error);
		}
	}, [fileInfo, peerInfo, onSingleDownloadComplete]);

	useEffect(() => {
		if (downloadIndex === index && !downloadAttempted.current) {
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
					left={0}
					percent={receiverTransferProgress[fileInfo.fileId] ?? 0}
				/>
			)}
			<CustomTask label={label} state={taskState[state]} />
			{error && <Text color="red">⠀{error}</Text>}
		</Box>
	);
};

export default SingleFileTransferForReceiver;
