import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import AsciiIntro from './components/AsciiArt/AsciiIntro.js';
import Discover from './components/Discover.js';
import useLocalIP from './functions/ip.js';
import useComputerName from './functions/name.js';
import {useStore} from '@nanostores/react';
import {$baseInfo} from './stores/baseStore.js';
import {hasNullValue} from './functions/helper.js';
import {useCommands} from './functions/commands.js';

type Props = {
	name: string | undefined;
};

export default function App({name = 'Stranger'}: Props) {
	useCommands();
	useLocalIP();
	useComputerName();

	const baseInfo = useStore($baseInfo);

	return (
		<Box flexDirection="column">
			{/* {action == null && <AsciiIntro />} */}

			{!hasNullValue(baseInfo) && <Discover />}
		</Box>
	);
}
