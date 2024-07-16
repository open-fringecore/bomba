import React, {useEffect, useMemo, useState} from 'react';
import {Box, Text} from 'ink';
import ProgressBar from './ProgressBar.js';
import CustomTask from './CustomTask.js';
import {TransferStates} from '../../stores/fileHandlerStore.js';

export type TaskStates = {
	[key: string]: 'pending' | 'success' | 'error' | 'success' | 'loading';
};

type PropType = {
	progress: number;
	fileName: string;
	state: TransferStates;
	isStartedTransferring: boolean;
	isTransferComplete: boolean;
};
const SingleFileTransfer = ({
	progress,
	fileName,
	state,
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

export default SingleFileTransfer;
