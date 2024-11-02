import React, {useMemo} from 'react';
import {Box, Text} from 'ink';
import {SingleTransferFileInfo} from '@/types/storeTypes.js';
import CustomTask from '@/components/Misc/CustomTask.js';
import {adjustStringLength, formatBytes} from '@/functions/helper.js';
import {TaskStates} from '@/components/Transfer/Receiver/ReceiverSingleFileTransfer.js';
import ProgressBar from '@/components/Misc/ProgressBar.js';
import {spinners} from '@/components/Misc/Spinner.js';

type PropType = {
	file: SingleTransferFileInfo;
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

const SingleFileTransfer = ({file, longestNameLength}: PropType) => {
	const label = useMemo(() => {
		const fileName = adjustStringLength(file.fileName, longestNameLength);
		const formattedSize = formatBytes(file.totalSize);
		return `⠀${fileName} - ${formattedSize}`;
	}, [file, longestNameLength]);

	const progress = useMemo(
		() => Math.min((file.totalTransferred / file.totalSize) * 100, 100),
		[file.totalTransferred, file.totalSize],
	);

	return (
		<Box>
			<ProgressBar percent={progress} />
			<CustomTask
				frames={
					file.state == 'HASH_CHECKING' ? spinners.dotsMore : spinners.dots
				}
				color={file.state == 'HASH_CHECKING' ? 'blue' : undefined}
				label={label}
				state={taskState[file.state]}
			/>
			{file.errorMsg && <Text color="red">⠀{file.errorMsg}</Text>}
		</Box>
	);
};

export default SingleFileTransfer;
