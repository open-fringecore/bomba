import React from 'react';
import {Box} from 'ink';
import AsciiIntro from './components/AsciiArt/AsciiIntro.js';
import SenderList from './components/List/SenderList.js';

type Props = {
	name: string | undefined;
};

export default function App({name = 'Stranger'}: Props) {
	return (
		<Box flexDirection="column">
			{/* <Box>
				<AsciiIntro />
			</Box> */}
			<SenderList />
		</Box>
	);
}
