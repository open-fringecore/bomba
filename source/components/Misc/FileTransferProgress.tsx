import React, {useEffect, useMemo, useState} from 'react';
import {Box, Text} from 'ink';
import {$transferInfo} from '../../stores/fileHandlerStore.js';
import {listenKeys} from 'nanostores';
import ProgressBar from './ProgressBar.js';

type PropType = {
	peerID: string;
	transferData: {
		[fileID: string]: {
			progress: number;
			fileName: string;
		};
	};
};

type SingleFileTransferItemType = {
	progress: number;
	fileName: string;
};
const SingleFileTransferItem = ({
	progress,
	fileName,
}: SingleFileTransferItemType) => {
	return (
		<Box>
			<ProgressBar left={2} percent={progress} title={fileName} />
		</Box>
	);
};

const FileTransferProgress = ({peerID, transferData}: PropType) => {
	return (
		<Box flexDirection="column">
			<Text>Receiving Files...</Text>
			{Object.keys(transferData).map(key => (
				<SingleFileTransferItem
					key={key}
					progress={transferData[key]?.progress ?? 0}
					fileName={transferData[key]?.fileName ?? ''}
				/>
			))}
		</Box>
	);
};

export default FileTransferProgress;
