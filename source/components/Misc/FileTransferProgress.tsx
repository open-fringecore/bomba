import React, {useEffect, useMemo, useState} from 'react';
import {Box, Text} from 'ink';
import {$transferInfo} from '../../stores/fileHandlerStore.js';
import {listenKeys} from 'nanostores';

type PropType = {
	peerID: string;
	transferData: {
		[fileID: string]: {
			progress: number;
		};
	};
};
const FileTransferProgress = ({peerID, transferData}: PropType) => {
	return (
		<Box flexDirection="column">
			{Object.keys(transferData).map(key => (
				<Text key={key}>{transferData[key]?.progress}%</Text>
			))}
		</Box>
	);
};

export default FileTransferProgress;
