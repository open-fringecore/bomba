import {atom} from 'nanostores';

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
	HTTP_PORT: 8779,
});

export type PeerType = {
	ip: string;
	name: string;
	isSending: boolean;
	httpPort: number;
};
export const $peers = atom<PeerType[]>([]);

export const addUser = (newUser: PeerType) => {
	const currentUsers = $peers.get();

	const isUserAlreadyExist = currentUsers?.find(item => item.ip == newUser.ip);

	if (isUserAlreadyExist) {
		return false;
	}

	$peers.set([...currentUsers, newUser]);
	return true;
};
