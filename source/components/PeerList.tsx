import React, {useMemo} from 'react';
import SelectInput from 'ink-select-input';
import {Box, Text} from 'ink';
import {useStore} from '@nanostores/react';
import {$peersFiles} from '@/stores/receiverfileHandlerStore.js';
import {formatBytes} from '@/functions/helper.js';
import {ConnectedPeersType} from '@/types/storeTypes.js';

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
				const label =
					totalFiles > 0
						? `${value.name} - ${totalFiles} files | ${formattedSize}`
						: `${value.name}`;

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
		<Box flexDirection="column" marginTop={1} marginLeft={1}>
			{items.length > 0 && (
				<Box marginBottom={1}>
					<Text>
						Press <Text backgroundColor="#A855F7">⠀↩ Enter⠀</Text> to select
						peer
					</Text>
				</Box>
			)}
			<SelectInput items={items} onSelect={handleSelect} />
		</Box>
	);
};

export default PeerList;
