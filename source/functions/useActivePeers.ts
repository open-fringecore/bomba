import {useCallback, useEffect} from 'react';
import {
	$discoveredPeers,
	addConnectedPeer,
	DiscoveredPeerType,
	removeConnectedPeer,
	removeDiscoveredPeer,
} from '../stores/peersStore.js';
import {useStore} from '@nanostores/react';
import {v4 as uuidv4} from 'uuid';
import {
	$transferInfo,
	removeSingleTransferInfo,
	SingleTransferInfo,
} from '../stores/fileHandlerStore.js';
import {SingleSendingFileType} from '../stores/baseStore.js';

export const useActivePeers = () => {
	const discoveredPeers = useStore($discoveredPeers);

	const pollingDiscoveredPeers = useCallback(
		(discoveredPeer: DiscoveredPeerType, is_first_call: boolean) => {
			fetch(
				`http://${discoveredPeer.ip}:${
					discoveredPeer.httpPort
				}/get-active-peer?${is_first_call ? 'is_first_call' : ''}`,
			)
				.then(response => response.json())
				.then(data => {
					// console.log('🟢 Peer Active 🟢');

					if (is_first_call) {
						addConnectedPeer({
							id: discoveredPeer.id,
							ip: discoveredPeer.ip,
							name: discoveredPeer.name,
							httpPort: discoveredPeer.httpPort,
							isSending: data.isSending,
						});

						const {sendingFileNames} = data;
						if (sendingFileNames) {
							const peerTransferInfo = Object.entries(sendingFileNames)?.reduce(
								(acc: SingleTransferInfo, [key, value]) => {
									acc[key] = {
										...(value as SingleSendingFileType),
										state: 'DEFAULT',
										progress: 0,
										downloadedSize: 7005,
									};
									return acc;
								},
								{},
							);

							$transferInfo.setKey(`${discoveredPeer.id}`, peerTransferInfo);
						}
					}
					pollingDiscoveredPeers(discoveredPeer, false);
				})
				.catch(error => {
					// console.log('⭕ Peer Gone ⭕');
					// console.log(error);
					removeConnectedPeer(discoveredPeer.id);
					removeDiscoveredPeer(discoveredPeer.id);
					removeSingleTransferInfo(discoveredPeer.id);
				});
		},
		[discoveredPeers],
	);

	// TODO:: This code might cause issues like calling same peers multiple times
	useEffect(() => {
		Object.keys(discoveredPeers).forEach(peerID => {
			const peer = discoveredPeers[peerID];
			if (peer) {
				pollingDiscoveredPeers(peer, true);
			}
		});
	}, [discoveredPeers]);
};
