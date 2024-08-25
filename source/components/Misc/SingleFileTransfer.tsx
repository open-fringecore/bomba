import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import ProgressBar from '@/components/Misc/ProgressBar.js';
import CustomTask from '@/components/Misc/CustomTask.js';
import {
	CurrTransferPeerInfo,
	TransferStates,
} from '@/stores/fileHandlerStore.js';
import {useFileDownloader} from '@/functions/useFileDownloader.js';
import {useHashCheck} from '@/functions/useHashCheck.js';
import {log} from '@/functions/log.js';

export type TaskStates = {
	[key: string]: 'pending' | 'success' | 'error' | 'success' | 'loading';
};

type PropType = {
	progress: number;
	fileID: string;
	fileName: string;
	state: TransferStates;
	error?: string;
	isStartedTransferring: boolean;
	isTransferComplete: boolean;
	peerInfo: CurrTransferPeerInfo;
};
const SingleFileTransfer = ({
	progress,
	fileID,
	fileName,
	state,
	error,
	isStartedTransferring,
	isTransferComplete,
	peerInfo,
}: PropType) => {
	const taskState: TaskStates = {
		DEFAULT: 'pending',
		TRANSFERRING: 'loading',
		TRANSFERRED: 'loading',
		ERROR: 'error',
		SUCCESS: 'success',
	};

	const downloadSingleFile = async (
		fileID: string,
		fileName: string,
		peer: CurrTransferPeerInfo,
	) => {
		await useFileDownloader(peer.peerIP, peer.peerHttpPort, fileID, fileName);
		await useHashCheck(peer.peerIP, peer.peerHttpPort, fileID, fileName);
	};

	useEffect(() => {
		log(`📥 Downloading: ${fileName}`);
		downloadSingleFile(fileID, fileName, peerInfo);
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
			<CustomTask label={`⠀${fileName}`} state={taskState[state]} />
			{error && <Text color={'red'}>⠀{error}</Text>}
		</Box>
	);
};

export default SingleFileTransfer;
