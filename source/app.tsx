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
import {$currTransfer} from '@/stores/receiverfileHandlerStore.js';
import MainApp from '@/components/MainApp.js';

type TProps = {
	name?: string;
};

export default function App({name = 'Stranger'}: TProps) {
	// console.clear();

	useCommands();
	useLocalIP();
	useComputerName();

	const baseInfo = useStore($baseInfo);
	const action = useStore($action);

	return hasNullValue(baseInfo) ? (
		<Box flexDirection="column">
			{action == 'NOTHING' ? <AsciiIntro /> : <Text>Setting up...</Text>}
		</Box>
	) : (
		<MainApp />
	);
}
