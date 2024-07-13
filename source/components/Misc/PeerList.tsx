import React, {useEffect, useMemo, useState} from 'react';
import {Box, Newline, Text, useInput, useStdin} from 'ink';
import {ConnectedPeersType} from '../../stores/peersStore.js';
import {useFileDownloader} from '../../functions/useFileDownloader.js';
import {useStore} from '@nanostores/react';
import {$transferInfo} from '../../stores/fileHandlerStore.js';
import FileTransfer from './FileTransfer.js';
import ProgressBar from './ProgressBar.js';
import {logToFile} from '../../functions/log.js';
import {$baseInfo} from '../../stores/baseStore.js';

type PropsType = {
	peers: ConnectedPeersType;
};

export default function PeerList({peers}: PropsType) {
	if (!peers) throw new Error('No sender found');

	const transferInfo = useStore($transferInfo);

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
			const peerID = peersIds[selectedIndex];
			if (!peerID) {
				console.log('Peer ID not found');
				return;
			}
			const selectedPeer = peers[peerID];
			const selectedPeerTransferInfo = transferInfo[peerID];

			if (!selectedPeer) {
				console.log('Selected Peer not found');
				return;
			}
			if (!selectedPeerTransferInfo) {
				console.log('⭕ No sending files found ⭕');
				return;
			}

			// console.log(selectedPeer, fileNames);

			Object.entries(selectedPeerTransferInfo)?.forEach(
				async ([key, value]) => {
					// console.log(`Downloading: ${value.fileName}`);
					await useFileDownloader(
						selectedPeer.id,
						selectedPeer.ip,
						selectedPeer.httpPort,
						key,
						value.fileName,
					);
				},
			);
		}
	});

	useEffect(() => {
		logToFile('transferInfo', $baseInfo.get().MY_NAME, transferInfo);
	}, [transferInfo]);

	return (
		<Box flexDirection="column" marginTop={1} marginLeft={1}>
			{Object.keys(peers).map(key => (
				<Box key={key} flexDirection="column">
					<Box
						borderColor={key === peersIds[selectedIndex] ? 'green' : 'black'}
						borderStyle={key === peersIds[selectedIndex] ? 'bold' : 'single'}
						paddingX={1}
					>
						<Box flexDirection="column">
							<Box>
								<Text backgroundColor="green" color="white" bold>
									{' '}
									{peers[key]?.name}{' '}
								</Text>
							</Box>
							{transferInfo[key] && (
								<FileTransfer peerID={key} transferData={transferInfo[key]!} />
							)}
						</Box>
					</Box>
				</Box>
			))}
		</Box>
	);
}
