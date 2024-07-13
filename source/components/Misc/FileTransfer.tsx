import React, {useEffect, useMemo, useState} from 'react';
import {Box, Text} from 'ink';
import {
	$transferInfo,
	SingleTransferInfo,
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
	fileName?: string;
};
const SingleFileTransfer = ({progress, fileName}: SingleFileTransferType) => {
	return (
		<Box>
			<ProgressBar left={2} percent={progress} />
			<Task
				label={fileName ?? ''}
				state={progress == 100 ? 'success' : 'loading'}
				spinner={spinners.dots}
			/>
		</Box>
	);
};

const FileTransfer = ({peerID, transferData}: PropType) => {
	return (
		<Box flexDirection="column">
			<Text>Receiving Files...</Text>
			{Object.keys(transferData).map(key => (
				<SingleFileTransfer
					key={key}
					progress={transferData[key]?.progress ?? 0}
					fileName={transferData[key]?.fileName}
				/>
			))}
		</Box>
	);
};

export default FileTransfer;
