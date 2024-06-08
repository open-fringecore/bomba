import {useCallback, useEffect} from 'react';
import {
	$discoveredPeers,
	addConnectedPeer,
	DiscoveredPeerType,
	removeConnectedPeer,
} from '../stores/baseStore.js';
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
				});
		},
		[discoveredPeers],
	);

	useEffect(() => {
		discoveredPeers.forEach(peer => {
			pollingDiscoveredPeers(peer);
		});
	}, [discoveredPeers]);
};
