import {$errorMsg} from '@/stores/baseStore.js';
import {useStore} from '@nanostores/react';
import {Box, Text, useApp} from 'ink';
import React, {useEffect} from 'react';

const Failed = () => {
	const errorMsg = useStore($errorMsg);

	const {exit} = useApp();

	useEffect(() => {
		if (errorMsg) {
			exit();
		}
	}, [errorMsg]);

	return (
		<Box>
			<Text color={'red'} bold>
				{errorMsg}
			</Text>
		</Box>
	);
};

export default Failed;
