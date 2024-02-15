import React, {useEffect, useState} from 'react';
import {Box, Newline, Text, useInput, useStdin} from 'ink';

type Prop = {};

export default function SenderList({}: Prop) {
	const [users, setUsers] = useState([
		{
			name: 'Mr. Man',
		},
		{
			name: 'Iron Man',
		},
		{
			name: 'Hulk Hogan',
		},
	]);
	const [selectedIndex, setSelectedIndex] = useState(0);

	useInput((input, key) => {
		if (key.downArrow) {
			setSelectedIndex(prevIndex => (prevIndex + 1) % users.length);
		} else if (key.upArrow) {
			setSelectedIndex(
				prevIndex => (prevIndex - 1 + users.length) % users.length,
			);
		}
	});

	return (
		<Box flexDirection="column">
			<>
				{users.map((item, index) => (
					<Text key={index} inverse={index === selectedIndex}>
						{item?.name}
					</Text>
				))}
			</>
		</Box>
	);
}
