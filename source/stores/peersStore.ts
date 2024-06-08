import {atom} from 'nanostores';

export type DiscoveredPeerType = {
	ip: string;
	name: string;
	httpPort: number;
};
export type DiscoveredPeersType = {
	[key: string]: DiscoveredPeerType;
};
export const $discoveredPeers = atom<DiscoveredPeerType[]>([]);

export const addDiscoveredPeer = (newPeer: DiscoveredPeerType) => {
	const currDiscoveredPeers = $discoveredPeers.get();

	const isPeerAlreadyExist = currDiscoveredPeers?.find(
		item => item.ip == newPeer.ip,
	);

	if (isPeerAlreadyExist) {
		return false;
	}

	$discoveredPeers.set([...currDiscoveredPeers, newPeer]);
	return true;
};

export const removeDiscoveredPeer = (ip: string) => {
	const currDiscoveredPeers = $discoveredPeers.get();
	const filteredPeers = currDiscoveredPeers?.filter(item => item.ip != ip);
	$discoveredPeers.set(filteredPeers);
};

export type ConnectedPeerType = {
	ip: string;
	name: string;
	isSending: boolean;
	sendFilenames: string[];
	httpPort: number;
};
export const $connectedPeers = atom<ConnectedPeerType[]>([]);

export const addConnectedPeer = (newPeer: ConnectedPeerType) => {
	const currConnectedPeers = $connectedPeers.get();

	const isPeerAlreadyExist = currConnectedPeers?.find(
		item => item.ip == newPeer.ip,
	);

	if (isPeerAlreadyExist) {
		return false;
	}

	$connectedPeers.set([...currConnectedPeers, newPeer]);
	return true;
};

export const removeConnectedPeer = (ip: string) => {
	const currConnectedPeers = $connectedPeers.get();
	const filteredPeers = currConnectedPeers?.filter(item => item.ip != ip);
	$connectedPeers.set(filteredPeers);
};
