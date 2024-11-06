import React from 'react';
import {Box, Text} from 'ink';
import AsciiIntro from '@/components/AsciiArt/AsciiIntro.js';
import Discover from '@/components/Discover.js';
import useLocalIP from '@/functions/ip.js';
import useComputerName from '@/functions/name.js';
import {useStore} from '@nanostores/react';
import {$action, $baseInfo} from '@/stores/baseStore.js';
import {hasNullValue} from '@/functions/helper.js';
import {useCommands} from '@/functions/commands.js';
import MainApp from '@/components/MainApp.js';
import {Spinner, spinners} from '@/components/Misc/Spinner.js';
import Failed from '@/components/Misc/Failed.js';

type TProps = {
	name?: string;
};

export default function App({name = 'Stranger'}: TProps) {
	useCommands();
	useLocalIP();
	useComputerName();

	const baseInfo = useStore($baseInfo);
	const action = useStore($action);

	return (
		<>
			{hasNullValue(baseInfo) ? (
				<Text>
					<Spinner frames={spinners.dotsRound} color="magenta" />⠀ Setting up...
				</Text>
			) : ['SEND', 'RECEIVE'].includes(action) ? (
				<MainApp />
			) : (
				<></>
			)}
			<Failed />
		</>
	);
}
