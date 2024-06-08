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
		(discoveredPeer: DiscoveredPeerType) => {
			fetch(
				`http://${discoveredPeer.ip}:${discoveredPeer.httpPort}/get-active-status`,
			)
				.then(response => response.json())
				.then(data => {
					// console.log('🟢 Peer Active 🟢');

					addConnectedPeer({
						id: discoveredPeer.id,
						ip: discoveredPeer.ip,
						name: discoveredPeer.name,
						httpPort: discoveredPeer.httpPort,
						isSending: false,
						sendFilenames: [''],
					});
					pollingDiscoveredPeers(discoveredPeer);
				})
				.catch(error => {
					// console.log('⭕ Peer Gone ⭕');
					removeConnectedPeer(discoveredPeer.ip);
					removeDiscoveredPeer(discoveredPeer.ip);
				});
		},
		[discoveredPeers],
	);

	useEffect(() => {
		Object.keys(discoveredPeers).forEach(peerID => {
			const peer = discoveredPeers[peerID];
			if (peer) {
				addConnectedPeer({
					id: peer.id,
					ip: peer.ip,
					name: peer.name,
					httpPort: peer.httpPort,
					isSending: false,
					sendFilenames: [''],
				});
				pollingDiscoveredPeers(peer);
			}
		});
	}, [discoveredPeers]);
};
