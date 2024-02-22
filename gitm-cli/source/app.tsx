import React, {useState} from 'react';
import {Box, Text} from 'ink';
import AsciiIntro from './components/AsciiArt/AsciiIntro.js';
import Sender from './components/Sender/Sender.js';
import Receiver from './components/Receiver/Receiver.js';

type Props = {
	name: string | undefined;
};

export default function App({name = 'Stranger'}: Props) {
	const [action, setAction] = useState(process.argv[2]);

	return (
		<Box flexDirection="column">
			<Text>{process.argv[2]}</Text>

			{action == null && <AsciiIntro />}

			{action == 'SEND' && <Sender></Sender>}
			{action == 'RECEIVE' && <Receiver></Receiver>}
		</Box>
	);
}
