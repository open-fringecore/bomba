import {useCallback, useEffect} from 'react';
import {$peers} from '../stores/baseStore.js';
import {useStore} from '@nanostores/react';

export const useActivePeers = () => {
	const peers = useStore($peers);

	const pollingPeers = useCallback(
		(ip: string, port: number) => {
			fetch(`http:/${ip}:${port}/get-active-status`)
				.then(response => response.json())
				.then(data => {
					console.log(data);
					pollingPeers(ip, port);
				})
				.catch(error => {
					console.log('🟢 Peer Gone 🟢');
					console.error('Error:', error);
				});
		},
		[peers],
	);

	useEffect(() => {
		peers.forEach(peer => {
			console.log('🚧');
			pollingPeers(peer.ip, peer.httpPort);
		});
	}, [peers]);
};
