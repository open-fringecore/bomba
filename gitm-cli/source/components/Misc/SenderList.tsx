import React, {useEffect, useState} from 'react';
import {Box, Newline, Text, useInput, useStdin} from 'ink';
import {SendersType} from '../Receiver/Receiver.js';

type PropType = {
	senders: SendersType;
};

export default function SenderList({senders}: PropType) {
	if (!senders) throw new Error('No sender found');

	const [selectedIndex, setSelectedIndex] = useState(0);

	useInput((input, key) => {
		if (key.downArrow) {
			setSelectedIndex(prevIndex => (prevIndex + 1) % senders.length);
		} else if (key.upArrow) {
			setSelectedIndex(
				prevIndex => (prevIndex - 1 + senders.length) % senders.length,
			);
		}
	});

	return (
		<Box flexDirection="column" marginTop={1} marginLeft={1}>
			{senders.map((item, index) => (
				<Box
					key={index}
					borderColor={index === selectedIndex ? 'green' : 'black'}
					borderStyle={index === selectedIndex ? 'bold' : 'single'}
					paddingX={1}
				>
					<Text>{item?.name}</Text>
				</Box>
			))}
		</Box>
	);
}
