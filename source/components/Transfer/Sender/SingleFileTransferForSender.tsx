import React from 'react';
import {Box, Text} from 'ink';
import {SingleTransferFileInfo} from '@/types/storeTypes.js';

type PropType = {
	file: SingleTransferFileInfo;
};
const SingleFileTransferForSender = ({file}: PropType) => {
	return (
		<Box>
			<Text>{file.fileName}</Text>
		</Box>
	);
};

export default SingleFileTransferForSender;
