import {useEffect} from 'react';
import {$peers} from '../stores/baseStore.js';
import {useStore} from '@nanostores/react';

export const useActivePeers = () => {
	const peers = useStore($peers);

	useEffect(() => {
		peers.forEach(peer => {
			console.log('🚧');
			fetch(`http:/${peer.ip}:${peer.httpPort}/get-active-status`)
				.then(response => response.json())
				.then(data => {
					console.log(data);
				})
				.catch(error => {
					console.error('Error:', error);
				});
		});
	}, [peers]);
};
