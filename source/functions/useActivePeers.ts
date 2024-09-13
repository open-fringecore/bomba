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
import {log, logError} from '@/functions/log.js';

export const useActivePeers = () => {
	const discoveredPeers = useStore($discoveredPeers);
	const activePolls = useRef<{[key: string]: AbortController}>({});

	const getActivePeerInfo = useCallback(
		(discoveredPeer: DiscoveredPeerType) => {
			fetch(
				`http://${discoveredPeer.ip}:${discoveredPeer.httpPort}/get-active-peer-info`,
			)
				.then(response => response.json())
				.then(data => {
					log('Active Peer Info', data);

					addConnectedPeer({
						id: discoveredPeer.id,
						ip: discoveredPeer.ip,
						name: discoveredPeer.name,
						httpPort: discoveredPeer.httpPort,
						isSending: data.isSending,
					});

					const {sendingFileNames} = data;
					if (sendingFileNames) {
						const peerFiles = Object.entries(sendingFileNames).reduce(
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
				})
				.catch(error => {
					logError('Error getting active peer info', error);
				});
		},
		[],
	);
	const pollingDiscoveredPeers = useCallback(
		async (
			discoveredPeer: DiscoveredPeerType,
			abortController: AbortController,
		) => {
			try {
				const response = await fetch(
					`http://${discoveredPeer.ip}:${discoveredPeer.httpPort}/get-active-peer`,
					{signal: abortController.signal},
				);
				await response.json();

				if (abortController.signal.aborted) return;

				pollingDiscoveredPeers(discoveredPeer, abortController);
			} catch (error) {
				// log('⭕ Peer Gone ⭕');
				// logError(error);
				if ((error as Error).name === 'AbortError') return;
				removeConnectedPeer(discoveredPeer.id);
				removeDiscoveredPeer(discoveredPeer.id);
				delete activePolls.current[discoveredPeer.id];
			}
		},
		[],
	);

	useEffect(() => {
		const pollActivePeers = async () => {
			for (const peerID in discoveredPeers) {
				const peer = discoveredPeers[peerID];
				if (peer && !activePolls.current[peerID]) {
					const abortController = new AbortController();
					activePolls.current[peerID] = abortController;
					await getActivePeerInfo(peer);
					pollingDiscoveredPeers(peer, abortController);
				}
			}
		};

		pollActivePeers();

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
	}, [discoveredPeers, getActivePeerInfo, pollingDiscoveredPeers]);
};
