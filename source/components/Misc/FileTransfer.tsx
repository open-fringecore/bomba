import React, {useEffect, useMemo, useState} from 'react';
import {Box, Text} from 'ink';
import SingleFileTransfer from './SingleFileTransfer.js';
import {logToFile} from '../../functions/log.js';
import {$currTransfer} from '../../stores/fileHandlerStore.js';
import {useStore} from '@nanostores/react';
import {computed} from 'nanostores';

type PropType = {
	peerID: string;
};
const FileTransfer = ({peerID}: PropType) => {
	const currTransfer = useStore($currTransfer);

	// const files = computed($currTransfer, (data) => data.files);
	const files = currTransfer.files;

	const totalDefault = useMemo(
		() =>
			Object.keys(files)?.reduce((acc, key) => {
				const state = files[key]?.state ?? 'DEFAULT';
				return ['DEFAULT'].includes(state) ? acc + 1 : acc;
			}, 0),
		[files],
	);
	const totalComplete = useMemo(
		() =>
			Object.keys(files)?.reduce((acc, key) => {
				const state = files[key]?.state ?? 'DEFAULT';
				return ['SUCCESS', 'ERROR'].includes(state) ? acc + 1 : acc;
			}, 0),
		[files],
	);
	const isStartedTransferring = totalDefault !== Object.keys(files)?.length;
	const isTransferComplete = totalComplete === Object.keys(files)?.length;

	useEffect(() => {
		console.log('💯 File Changes Detecting... 💯');
	}, [files]);

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
				TC: {totalComplete} - TF: {Object.keys(files)?.length}
			</Text>
			{Object.keys(files).map(key => (
				<SingleFileTransfer
					key={key}
					progress={files[key]?.progress ?? 0}
					fileName={files[key]?.fileName!}
					state={files[key]?.state!}
					isStartedTransferring={isStartedTransferring}
					isTransferComplete={isTransferComplete}
				/>
			))}
		</Box>
	);
};

export default FileTransfer;
