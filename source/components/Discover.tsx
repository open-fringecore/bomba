import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import {Spinner} from './Misc/Spinner.js';
import {useStore} from '@nanostores/react';
import {$baseInfo} from '../stores/baseStore.js';

const Discover = () => {
	const baseInfo = useStore($baseInfo);
	useEffect(() => {
		console.log(baseInfo);
	}, [baseInfo]);

	return (
		<Box flexDirection="column">
			{true && (
				<Text>
					<Spinner /> Discovering
				</Text>
			)}
		</Box>
	);
};

export default Discover;
