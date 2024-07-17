import React, {useMemo} from 'react';
// import {render} from 'ink';
import SelectInput from 'ink-select-input';
import {ConnectedPeersType} from '../../stores/peersStore.js';
import {Box} from 'ink';
import {useStore} from '@nanostores/react';
import {$transferInfo} from '../../stores/fileHandlerStore.js';
import {useFileDownloader} from '../../functions/useFileDownloader.js';
import {useHashCheck} from '../../functions/useHashCheck.js';

type ItemType = {
	label: string;
	value: string;
};
type ItemsType = ItemType[];
type PropsType = {
	peers: ConnectedPeersType;
};
const PeerList = ({peers}: PropsType) => {
	const transferInfo = useStore($transferInfo);

	const items: ItemsType = useMemo(
		() =>
			Object.entries(peers)?.map(([key, value]) => ({
				label: value.name,
				value: key,
			})),
		[peers],
	);

	const handleSelect = (item: ItemType) => {
		const selectedPeer = peers[item.value];
		const selectedPeerTransferInfo = transferInfo[item.value];

		if (!selectedPeer) {
			console.log('Selected Peer not found');
			return;
		}
		if (!selectedPeerTransferInfo) {
			console.log('⭕ No sending files found ⭕');
			return;
		}

		const files = selectedPeerTransferInfo.files;
		Object.entries(files)?.forEach(async ([key, value]) => {
			console.log(`Downloading: ${value.fileName}`);
			await useFileDownloader(
				selectedPeer.id,
				selectedPeer.ip,
				selectedPeer.httpPort,
				key,
				value.fileName,
			);
			await useHashCheck(
				selectedPeer.id,
				selectedPeer.ip,
				selectedPeer.httpPort,
				key,
				value.fileName,
			);
		});
	};

	return (
		<Box marginTop={1} marginLeft={1}>
			<SelectInput items={items} onSelect={handleSelect} />
		</Box>
	);
};

export default PeerList;
