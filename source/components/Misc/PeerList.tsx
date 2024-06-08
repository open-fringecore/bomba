import React, {useEffect, useMemo, useState} from 'react';
import {Box, Newline, Text, useInput, useStdin} from 'ink';
import {ConnectedPeersType} from '../../stores/peersStore.js';

type PropType = {
	peers: ConnectedPeersType;
};

export default function PeerList({peers}: PropType) {
	if (!peers) throw new Error('No sender found');

	const peersIds = useMemo(() => Object.keys(peers).map(key => key), [peers]);
	const [selectedIndex, setSelectedIndex] = useState<number>(0);

	useInput((input, key) => {
		if (key.downArrow) {
			setSelectedIndex(prevIndex => (prevIndex + 1) % peersIds.length);
		} else if (key.upArrow) {
			setSelectedIndex(
				prevIndex => (prevIndex - 1 + peersIds.length) % peersIds.length,
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
			{Object.keys(peers).map(key => (
				<Box
					key={key}
					borderColor={key === peersIds[selectedIndex] ? 'green' : 'black'}
					borderStyle={key === peersIds[selectedIndex] ? 'bold' : 'single'}
					paddingX={1}
				>
					<Text>{peers[key]?.name}</Text>
				</Box>
			))}
		</Box>
	);
}
