import React, {useEffect, useState} from 'react';
import {Box, Newline, Text, useInput, useStdin} from 'ink';
import {useFileDownloader} from '../../functions/useFileDownloader.js';
import {useStore} from '@nanostores/react';
import {$receiverInfo} from '../../stores/receiverStore.js';
import {UserType} from '../../stores/baseStore.js';

type PropType = {
	users: UserType[];
};

export default function UserList({users}: PropType) {
	if (!users) throw new Error('No sender found');

	const [selectedIndex, setSelectedIndex] = useState(0);

	const receiverInfo = useStore($receiverInfo);

	useInput((input, key) => {
		if (key.downArrow) {
			setSelectedIndex(prevIndex => (prevIndex + 1) % users.length);
		} else if (key.upArrow) {
			setSelectedIndex(
				prevIndex => (prevIndex - 1 + users.length) % users.length,
			);
		} else if (key.return) {
			console.log(users[selectedIndex]);
			// const fileName = users[selectedIndex]?.fileName;
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
			{users.map((item, index) => (
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
