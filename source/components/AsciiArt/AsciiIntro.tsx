import React from 'react';
import {Box, Newline, Text} from 'ink';

type Prop = {};

export default function AsciiIntro({}: Prop) {
	return (
		<Box>
			<Box borderStyle="bold" paddingX={5} paddingY={2} borderColor="green">
				<Text color={'white'} wrap={'wrap'}>
					{` ░▒▓██████▓▒░░▒▓█▓▒░▒▓████████▓▒░▒▓██████████████▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░  ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░      ░▒▓█▓▒░  ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒▒▓███▓▒░▒▓█▓▒░  ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░  ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░  ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
 ░▒▓██████▓▒░░▒▓█▓▒░  ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░`}
				</Text>
			</Box>
		</Box>
	);
}
