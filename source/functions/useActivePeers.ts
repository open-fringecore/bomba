import {useCallback, useEffect} from 'react';
import {
	$discoveredPeers,
	addConnectedPeer,
	DiscoveredPeerType,
	removeConnectedPeer,
	removeDiscoveredPeer,
} from '../stores/peersStore.js';
import {useStore} from '@nanostores/react';

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
							sendFileNames: data.sendingFileNames,
						});
					}
					pollingDiscoveredPeers(discoveredPeer, false);
				})
				.catch(error => {
					// console.log('⭕ Peer Gone ⭕');
					// console.log(error);
					removeConnectedPeer(discoveredPeer.id);
					removeDiscoveredPeer(discoveredPeer.id);
				});
		},
		[discoveredPeers],
	);

	useEffect(() => {
		Object.keys(discoveredPeers).forEach(peerID => {
			const peer = discoveredPeers[peerID];
			if (peer) {
				pollingDiscoveredPeers(peer, true);
			}
		});
	}, [discoveredPeers]);
};
