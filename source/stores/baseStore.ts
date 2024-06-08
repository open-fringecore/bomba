import {atom} from 'nanostores';
import {getFreePort} from '../functions/freePort.js';

type InfoType = {
	MY_IP: string | null;
	MY_NAME: string | null;
	BROADCAST_ADDR: string | null;
	UDP_PORT: number;
	HTTP_PORT: number;
};

export const $baseInfo = atom<InfoType>({
	MY_IP: null,
	MY_NAME: null,
	BROADCAST_ADDR: null,
	UDP_PORT: 8008,
	HTTP_PORT: (await getFreePort()) ?? 8779,
});

export type DiscoveredPeerType = {
	ip: string;
	name: string;
	httpPort: number;
};
export const $discoveredPeers = atom<DiscoveredPeerType[]>([]);

export type ConnectedPeerType = {
	ip: string;
	name: string;
	isSending: boolean;
	sendFilenames: string[];
	httpPort: number;
};
export const $connectedPeers = atom<ConnectedPeerType[]>([]);

// ! -------------------------- FUNCTIONS --------------------------

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
