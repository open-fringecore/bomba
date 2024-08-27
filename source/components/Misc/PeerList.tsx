import React, {useMemo} from 'react';
import SelectInput from 'ink-select-input';
import {ConnectedPeersType} from '@/stores/peersStore.js';
import {Box} from 'ink';
import {useStore} from '@nanostores/react';
import {$peersFiles} from '@/stores/fileHandlerStore.js';
import {formatBytes} from '@/functions/helper.js';

type ItemType = {
	label: string;
	value: string;
};
type ItemsType = ItemType[];
type PropsType = {
	peers: ConnectedPeersType;
	onSelect: (peerID: string) => void;
};
const PeerList = ({peers, onSelect}: PropsType) => {
	const peersFiles = useStore($peersFiles);

	const onlySenders = useMemo(
		() => Object.entries(peers)?.filter(([key, value]) => true),
		[peers],
	);
	const items: ItemsType = useMemo(
		() =>
			onlySenders?.map(([key, value]) => {
				const selectedPeerFiles = peersFiles[key] ?? {};
				const totalFiles = Object.keys(selectedPeerFiles).length;
				const totalSize = Object.values(selectedPeerFiles).reduce(
					(acc, item) => acc + (item?.fileSize ?? 0),
					0,
				);
				const formattedSize = formatBytes(totalSize);
				const label = `${value.name} - ${totalFiles} files | ${formattedSize}`;

				return {
					label: label,
					value: key,
				};
			}),
		[onlySenders, peersFiles],
	);

	const handleSelect = (item: ItemType) => {
		if (item) onSelect(item.value);
	};

	return (
		<Box marginTop={1} marginLeft={1}>
			<SelectInput items={items} onSelect={handleSelect} />
		</Box>
	);
};

export default PeerList;
