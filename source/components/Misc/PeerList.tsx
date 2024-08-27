import React, {useMemo} from 'react';
// import {render} from 'ink';
import SelectInput from 'ink-select-input';
import {ConnectedPeersType} from '@/stores/peersStore.js';
import {Box} from 'ink';

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
	const onlySenders = useMemo(
		() => Object.entries(peers)?.filter(([key, value]) => value.isSending),
		[peers],
	);
	const items: ItemsType = useMemo(
		() =>
			onlySenders?.map(([key, value]) => ({
				label: value.name,
				value: key,
			})),
		[onlySenders],
	);

	const handleSelect = (item: ItemType) => {
		onSelect(item.value);
	};

	return (
		<Box marginTop={1} marginLeft={1}>
			<SelectInput items={items} onSelect={handleSelect} />
		</Box>
	);
};

export default PeerList;
