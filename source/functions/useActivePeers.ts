import {useCallback, useEffect, useRef} from 'react';
import {
	$discoveredPeers,
	addConnectedPeer,
	removeConnectedPeer,
	removeDiscoveredPeer,
} from '@/stores/peersStore.js';
import {useStore} from '@nanostores/react';
import {$peersFiles} from '@/stores/fileHandlerStore.js';
import {
	DiscoveredPeerType,
	Files,
	SingleSendingFile,
} from '@/types/storeTypes.js';

export const useActivePeers = () => {
	const discoveredPeers = useStore($discoveredPeers);
	const activePolls = useRef<{[key: string]: AbortController}>({});

	const pollingDiscoveredPeers = useCallback(
		(
			discoveredPeer: DiscoveredPeerType,
			is_first_call: boolean,
			abortController: AbortController,
		) => {
			fetch(
				`http://${discoveredPeer.ip}:${
					discoveredPeer.httpPort
				}/get-active-peer?${is_first_call ? 'is_first_call' : ''}`,
				{signal: abortController.signal},
			)
				.then(response => response.json())
				.then(data => {
					// log('🟢 Peer Active 🟢');

					if (abortController.signal.aborted) return;

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
					pollingDiscoveredPeers(discoveredPeer, false, abortController);
				})
				.catch(error => {
					if (error.name === 'AbortError') return;
					// log('⭕ Peer Gone ⭕');
					// log(error);
					removeConnectedPeer(discoveredPeer.id);
					removeDiscoveredPeer(discoveredPeer.id);
					delete activePolls.current[discoveredPeer.id];
				});
		},
		[],
	);

	useEffect(() => {
		Object.keys(discoveredPeers).forEach(peerID => {
			const peer = discoveredPeers[peerID];
			if (peer && !activePolls.current[peerID]) {
				const abortController = new AbortController();
				activePolls.current[peerID] = abortController;
				pollingDiscoveredPeers(peer, true, abortController);
			}
		});

		// ! Clean up polls for peers that are no longer discovered
		Object.keys(activePolls.current).forEach(peerID => {
			if (!discoveredPeers[peerID]) {
				activePolls.current[peerID]?.abort();
				delete activePolls.current[peerID];
			}
		});

		return () => {
			Object.values(activePolls.current).forEach(controller =>
				controller.abort(),
			);
			activePolls.current = {};
		};
	}, [discoveredPeers, pollingDiscoveredPeers]);
};
