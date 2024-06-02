import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import AsciiIntro from './components/AsciiArt/AsciiIntro.js';
import Sender from './components/Sender/Sender.js';
import Receiver from './components/Receiver/Receiver.js';
import Discover from './components/Discover.js';
import useLocalIP, {getLocalIP} from './functions/ip.js';

type Props = {
	name: string | undefined;
};

export default function App({name = 'Stranger'}: Props) {
	const [action, setAction] = useState(process.argv[2]);

	useLocalIP();

	return (
		<Box flexDirection="column">
			{/* {action == null && <AsciiIntro />} */}

			<Discover />
			{/* {action == 'SEND' && <Sender></Sender>} */}
			{/* {action == 'RECEIVE' && <Receiver></Receiver>} */}
		</Box>
	);
}
