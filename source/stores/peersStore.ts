import {
	ConnectedPeersType,
	ConnectedPeerType,
	DiscoveredPeersType,
	DiscoveredPeerType,
} from '@/types/storeTypes.js';
import {atom, deepMap} from 'nanostores';

export const $discoveredPeers = deepMap<DiscoveredPeersType>({});

export const addDiscoveredPeer = (newPeer: DiscoveredPeerType) => {
	const currDiscoveredPeers = $discoveredPeers.get();

	if (currDiscoveredPeers[newPeer.id]) {
		return false;
	}

	$discoveredPeers.set({...currDiscoveredPeers, [newPeer.id]: newPeer});
	return true;
};

export const removeDiscoveredPeer = (id: string) => {
	const currDiscoveredPeers = $discoveredPeers.get();

	if (currDiscoveredPeers.hasOwnProperty(id)) {
		const updatedPeers = {...currDiscoveredPeers};
		delete updatedPeers[id];
		$discoveredPeers.set(updatedPeers);
	}
};

export const $connectedPeers = deepMap<ConnectedPeersType>({});

export const addConnectedPeer = (newPeer: ConnectedPeerType) => {
	const currConnectedPeers = $connectedPeers.get();

	if (currConnectedPeers[newPeer.id]) {
		return false;
	}

	$connectedPeers.set({...currConnectedPeers, [newPeer.id]: newPeer});
	return true;
};

export const removeConnectedPeer = (id: string) => {
	const currConnectedPeers = $connectedPeers.get();

	if (currConnectedPeers.hasOwnProperty(id)) {
		const updatedPeers = {...currConnectedPeers};
		delete updatedPeers[id];
		$connectedPeers.set(updatedPeers);
	}
};
