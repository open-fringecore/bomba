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
import {statfs} from 'fs';

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

	const getDiskSpace = async () => {
		const drive = path.parse(process.cwd()).root;
		console.log('<><><>', drive);

		const space = statfs(drive, (err, stats) => {
			if (err) {
				throw err;
			}
			console.log('Total free space', stats.bsize * stats.bfree);
			console.log('Available for user', stats.bsize * stats.bavail);
		});

		console.log('space', space);
	};

	useEffect(() => {
		getDiskSpace();
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
