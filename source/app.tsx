import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import AsciiIntro from '@/components/AsciiArt/AsciiIntro';
import Discover from '@/components/Discover';
import useLocalIP from '@/functions/ip';
import useComputerName from '@/functions/name';
import {useStore} from '@nanostores/react';
import {$action, $baseInfo} from '@/stores/baseStore';
import {hasNullValue} from '@/functions/helper';
import {useCommands} from '@/functions/commands';

type Props = {
	name: string | undefined;
};

export default function App({name = 'Stranger'}: Props) {
	// console.clear();

	useCommands();
	useLocalIP();
	useComputerName();

	const baseInfo = useStore($baseInfo);
	const action = useStore($action);

	return (
		<Box flexDirection="column">
			{/* {action == 'NOTHING' && <AsciiIntro />} */}

			{!hasNullValue(baseInfo) && ['SEND', 'RECEIVE'].includes(action) && (
				<Discover />
			)}
		</Box>
	);
}
