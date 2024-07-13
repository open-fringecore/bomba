import React, {useEffect, useMemo, useState} from 'react';
import {Box, Text} from 'ink';
import {
	$transferInfo,
	SingleTransferInfo,
	TransferStates,
} from '../../stores/fileHandlerStore.js';
import {listenKeys} from 'nanostores';
import ProgressBar from './ProgressBar.js';
import {TaskList, Task} from 'ink-task-list';
import spinners from 'cli-spinners';

type PropType = {
	peerID: string;
	transferData: SingleTransferInfo;
};

type SingleFileTransferType = {
	progress: number;
	fileName: string;
	state: TransferStates;
};
export type TaskStates = {
	[key: string]: 'pending' | 'success' | 'error' | 'success' | 'loading';
};

const SingleFileTransfer = ({
	progress,
	fileName,
	state,
}: SingleFileTransferType) => {
	const taskState: TaskStates = {
		DEFAULT: 'pending',
		TRANSFERRING: 'loading',
		ERROR: 'error',
		SUCCESS: 'success',
	};

	return (
		<Box>
			{state != 'DEFAULT' && <ProgressBar left={2} percent={progress} />}
			<Task
				label={fileName ?? ''}
				state={taskState[state]}
				spinner={spinners.dots}
			/>
		</Box>
	);
};

const FileTransfer = ({peerID, transferData}: PropType) => {
	return (
		<Box flexDirection="column" marginTop={1}>
			<Text dimColor>Receiving Files...</Text>
			{Object.keys(transferData).map(key => (
				<SingleFileTransfer
					key={key}
					progress={transferData[key]?.progress ?? 0}
					fileName={transferData[key]?.fileName!}
					state={transferData[key]?.state!}
				/>
			))}
		</Box>
	);
};

export default FileTransfer;
