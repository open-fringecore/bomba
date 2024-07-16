import React, {useEffect, useMemo, useState} from 'react';
import {Box, Text} from 'ink';
import {
	$transferInfo,
	SinglePeerTransferInfo,
	TransferStates,
} from '../../stores/fileHandlerStore.js';
import {listenKeys} from 'nanostores';
import ProgressBar from './ProgressBar.js';
import {TaskList, Task} from 'ink-task-list';
import cliSpinners from 'cli-spinners';
import {Spinner, spinners} from './Spinner.js';
import CustomTask from './CustomTask.js';

type PropType = {
	peerID: string;
	transferData: SinglePeerTransferInfo;
};

type SingleFileTransferType = {
	progress: number;
	fileName: string;
	state: TransferStates;
	isStartedTransferring: boolean;
	isTransferComplete: boolean;
};
export type TaskStates = {
	[key: string]: 'pending' | 'success' | 'error' | 'success' | 'loading';
};

const SingleFileTransfer = ({
	progress,
	fileName,
	state,
	isStartedTransferring,
	isTransferComplete,
}: SingleFileTransferType) => {
	const taskState: TaskStates = {
		DEFAULT: 'pending',
		TRANSFERRING: 'loading',
		TRANSFERRED: 'loading',
		ERROR: 'error',
		SUCCESS: 'success',
	};

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
			<CustomTask label={fileName ?? ''} state={taskState[state]} />
		</Box>
	);
};

const FileTransfer = ({peerID, transferData}: PropType) => {
	const totalDefault = useMemo(
		() =>
			Object.keys(transferData)?.reduce((acc, key) => {
				const state = transferData[key]?.state ?? 'DEFAULT';
				if (['DEFAULT'].includes(state)) {
					return acc + 1;
				} else {
					return acc;
				}
			}, 0),
		[transferData],
	);
	const totalComplete = useMemo(
		() =>
			Object.keys(transferData)?.reduce((acc, key) => {
				const state = transferData[key]?.state ?? 'DEFAULT';
				if (['SUCCESS', 'ERROR'].includes(state)) {
					return acc + 1;
				} else {
					return acc;
				}
			}, 0),
		[transferData],
	);
	const isStartedTransferring =
		totalDefault !== Object.keys(transferData)?.length;
	const isTransferComplete =
		totalComplete === Object.keys(transferData)?.length;

	return (
		<Box flexDirection="column" marginTop={1}>
			<Text dimColor={true}>
				{isTransferComplete
					? 'Files Transfer Complete 🎉'
					: isStartedTransferring
					? 'Receiving Files...'
					: 'Files'}
			</Text>
			<Text dimColor={true}>
				TC: {totalComplete} - TF: {Object.keys(transferData)?.length}
			</Text>
			{Object.keys(transferData).map(key => (
				<SingleFileTransfer
					key={key}
					progress={transferData[key]?.progress ?? 0}
					fileName={transferData[key]?.fileName!}
					state={transferData[key]?.state!}
					isStartedTransferring={isStartedTransferring}
					isTransferComplete={isTransferComplete}
				/>
			))}
		</Box>
	);
};

export default FileTransfer;
