import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import AsciiIntro from '@/components/AsciiArt/AsciiIntro.js';
import Discover from '@/components/Discover.js';
import useLocalIP from '@/functions/ip.js';
import useComputerName from '@/functions/name.js';
import {useStore} from '@nanostores/react';
import {$action, $baseInfo} from '@/stores/baseStore.js';
import {hasNullValue} from '@/functions/helper.js';
import {useCommands} from '@/functions/commands.js';
import path from 'path';

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

	useEffect(() => {
		const drive = path.parse(process.cwd()).root;
		console.log('<><><>', drive);
	}, []);

	return (
		<Box flexDirection="column">
			{/* {action == 'NOTHING' && <AsciiIntro />} */}

			{!hasNullValue(baseInfo) && ['SEND', 'RECEIVE'].includes(action) && (
				<Discover />
			)}
		</Box>
	);
}
