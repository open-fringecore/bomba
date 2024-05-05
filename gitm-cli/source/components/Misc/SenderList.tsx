import React, {useEffect, useState} from 'react';
import {Box, Newline, Text, useInput, useStdin} from 'ink';
import {SendersType} from '../Receiver/Receiver.js';
import {useFileDownloader} from '../../functions/useFileDownloader.js';
import {useStore} from '@nanostores/react';
import {$receiverInfo} from '../../stores/receiverStore.js';

type PropType = {
	senders: SendersType;
};

export default function SenderList({senders}: PropType) {
	if (!senders) throw new Error('No sender found');

	const [selectedIndex, setSelectedIndex] = useState(0);

	const receiverInfo = useStore($receiverInfo);

	useInput((input, key) => {
		if (key.downArrow) {
			setSelectedIndex(prevIndex => (prevIndex + 1) % senders.length);
		} else if (key.upArrow) {
			setSelectedIndex(
				prevIndex => (prevIndex - 1 + senders.length) % senders.length,
			);
		} else if (key.return) {
			console.log(senders[selectedIndex]);
			const fileName = senders[selectedIndex]?.fileName;
			if (fileName) {
				useFileDownloader(
					receiverInfo.MY_IP,
					receiverInfo.OTHER_TCP_PORT,
					fileName,
				);
			} else {
				console.error('No filename.');
			}
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
