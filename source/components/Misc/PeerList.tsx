import React, {useEffect, useState} from 'react';
import {Box, Newline, Text, useInput, useStdin} from 'ink';
import {useStore} from '@nanostores/react';
import {$receiverInfo} from '../../stores/receiverStore.js';
import {ConnectedPeerType} from '../../stores/peersStore.js';

type PropType = {
	peers: ConnectedPeerType[];
};

export default function PeerList({peers}: PropType) {
	if (!peers) throw new Error('No sender found');

	const [selectedIndex, setSelectedIndex] = useState(0);

	const receiverInfo = useStore($receiverInfo);

	useInput((input, key) => {
		if (key.downArrow) {
			setSelectedIndex(prevIndex => (prevIndex + 1) % peers.length);
		} else if (key.upArrow) {
			setSelectedIndex(
				prevIndex => (prevIndex - 1 + peers.length) % peers.length,
			);
		} else if (key.return) {
			console.log(peers[selectedIndex]);
			// const fileName = peers[selectedIndex]?.fileName;
			// if (fileName) {
			// 	useFileDownloader(
			// 		receiverInfo.MY_IP,
			// 		receiverInfo.OTHER_TCP_PORT,
			// 		fileName,
			// 	);
			// } else {
			// 	console.error('No filename.');
			// }
		}
	});

	return (
		<Box flexDirection="column" marginTop={1} marginLeft={1}>
			{peers.map((item, index) => (
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
