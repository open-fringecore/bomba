import {useCallback, useEffect, useRef} from 'react';
import {$peers, removePeer} from '../stores/baseStore.js';
import {useStore} from '@nanostores/react';

export const useActivePeers = () => {
	const peers = useStore($peers);

	const pollingPeers = useCallback(
		(ip: string, port: number) => {
			fetch(`http://${ip}:${port}/get-active-status`)
				.then(response => response.json())
				.then(data => {
					// console.log('🟢 Peer Active 🟢');
					pollingPeers(ip, port);
				})
				.catch(error => {
					// console.log('⭕ Peer Gone ⭕');
					removePeer(ip);
				});
		},
		[peers],
	);

	useEffect(() => {
		peers.forEach(peer => {
			pollingPeers(peer.ip, peer.httpPort);
		});
	}, [peers]);
};
