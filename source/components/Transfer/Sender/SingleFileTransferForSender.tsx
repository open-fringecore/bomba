import React, {useMemo} from 'react';
import {Box, Text} from 'ink';
import {SingleTransferFileInfo} from '@/types/storeTypes.js';
import CustomTask from '@/components/Misc/CustomTask.js';
import {adjustStringLength, formatBytes} from '@/functions/helper.js';
import {TaskStates} from '@/components/Transfer/Receiver/SingleFileTransferForReceiver.js';

type PropType = {
	file: SingleTransferFileInfo;
	longestNameLength: number;
};

const taskState: TaskStates = {
	DEFAULT: 'pending',
	TRANSFERRING: 'loading',
	TRANSFERRED: 'loading',
	ERROR: 'error',
	SUCCESS: 'success',
};

const SingleFileTransferForSender = ({file, longestNameLength}: PropType) => {
	const label = useMemo(() => {
		const fileName = adjustStringLength(file.fileName, longestNameLength);
		const formattedSize = formatBytes(file.totalSize);
		return `⠀${fileName} - ${formattedSize}`;
	}, [file, longestNameLength]);

	return (
		<Box>
			<CustomTask label={label} state={taskState[file.state]} />
			{file.errorMsg && <Text color="red">⠀{file.errorMsg}</Text>}
		</Box>
	);
};

export default SingleFileTransferForSender;
