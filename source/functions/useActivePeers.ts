import {useCallback, useEffect} from 'react';
import {
	$discoveredPeers,
	addConnectedPeer,
	DiscoveredPeerType,
	removeConnectedPeer,
	removeDiscoveredPeer,
} from '@/stores/peersStore.js';
import {useStore} from '@nanostores/react';
import {v4 as uuidv4} from 'uuid';
import {$peersFiles, Files} from '@/stores/fileHandlerStore.js';
import {SingleSendingFile} from '@/stores/baseStore.js';

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
					// log('🟢 Peer Active 🟢');

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
							const peerFiles = Object.entries(sendingFileNames)?.reduce(
								(acc: Files, [key, value]) => {
									acc[key] = {
										fileId: key,
										...(value as SingleSendingFile),
									};
									return acc;
								},
								{},
							);

							$peersFiles.setKey(`${discoveredPeer.id}`, peerFiles);
						}
					}
					pollingDiscoveredPeers(discoveredPeer, false);
				})
				.catch(error => {
					// log('⭕ Peer Gone ⭕');
					// log(error);
					removeConnectedPeer(discoveredPeer.id);
					removeDiscoveredPeer(discoveredPeer.id);
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
