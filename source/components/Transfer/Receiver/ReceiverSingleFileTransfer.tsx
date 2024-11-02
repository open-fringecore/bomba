import React, {useEffect, useCallback, useRef} from 'react';
import {Box} from 'ink';
import {logError} from '@/functions/log.js';
import {
	checkEnoughSpace,
	useFileDownloader,
} from '@/functions/useFileDownloader.js';
import {useHashCheck} from '@/functions/useHashCheck.js';
import {
	TransferPeerInfo,
	TransferStates,
	SingleTransferFileInfo,
} from '@/types/storeTypes.js';
import {useStore} from '@nanostores/react';
import {$baseInfo} from '@/stores/baseStore.js';
import SingleFileTransfer from '@/components/Transfer/SingleFileTransfer.js';

type TaskStatus = 'pending' | 'success' | 'error' | 'loading';
export type TaskStates = Record<TransferStates, TaskStatus>;

type TProps = {
	index: number;
	downloadIndex: number;
	fileId: string;
	file: SingleTransferFileInfo;
	peerInfo: TransferPeerInfo;
	isStartedTransferring: boolean;
	isTransferComplete: boolean;
	onSingleDownloadComplete: () => void;
	longestNameLength: number;
};

const taskState: TaskStates = {
	DEFAULT: 'pending',
	TRANSFERRING: 'loading',
	TRANSFERRED: 'loading',
	HASH_CHECKING: 'loading',
	ERROR: 'error',
	SUCCESS: 'success',
};

const ReceiverSingleFileTransfer: React.FC<TProps> = ({
	index,
	downloadIndex,
	fileId,
	file,
	peerInfo,
	isStartedTransferring,
	isTransferComplete,
	onSingleDownloadComplete,
	longestNameLength,
}) => {
	const baseInfo = useStore($baseInfo);

	const downloadAttempted = useRef(false);

	const startDownload = useCallback(async () => {
		try {
			if (downloadAttempted.current) return;
			downloadAttempted.current = true;

			const {peerIP, peerHttpPort} = peerInfo;

			// const isNoDuplicationIssue = await checkDuplication(fileId, fileName);
			// if (!isNoDuplicationIssue) return;

			const isNoSpaceIssue = await checkEnoughSpace(fileId, file.totalSize);
			if (!isNoSpaceIssue) return;

			await useFileDownloader(
				baseInfo.MY_ID,
				peerIP,
				peerHttpPort,
				fileId,
				file.fileName,
				file.fileType,
				file.totalSize,
			);
			await useHashCheck(peerIP, peerHttpPort, fileId, file.fileName);
			onSingleDownloadComplete();
		} catch (error) {
			logError(error);
		}
	}, [file, peerInfo, onSingleDownloadComplete]);

	useEffect(() => {
		if (downloadIndex === index && !downloadAttempted.current) {
			startDownload();
		}
	}, [downloadIndex, index, startDownload]);

	return (
		<>
			<SingleFileTransfer file={file} longestNameLength={longestNameLength} />
		</>
	);
};

export default ReceiverSingleFileTransfer;
