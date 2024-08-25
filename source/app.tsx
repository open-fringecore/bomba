import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import AsciiIntro from '@/components/AsciiArt/AsciiIntro.js';
import Discover from '@/components/Discover.js';
import useLocalIP from '@/functions/ip.js';
import useComputerName from '@/functions/name.js';
import {useStore} from '@nanostores/react';
import {$action, $baseInfo} from '@/stores/baseStore.js';
import {hasNullValue} from '@/functions/helper.js';
import {useCommands} from '@/functions/commands.js';

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
