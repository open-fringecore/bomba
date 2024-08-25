import React, {useMemo} from 'react';
// import {render} from 'ink';
import SelectInput from 'ink-select-input';
import {ConnectedPeersType} from '@/stores/peersStore';
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
	const items: ItemsType = useMemo(
		() =>
			Object.entries(peers)?.map(([key, value]) => ({
				label: value.name,
				value: key,
			})),
		[peers],
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
