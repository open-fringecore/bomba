import {atom} from 'nanostores';

type InfoType = {
	MY_IP: string;
	BROADCAST_ADDR: string;
	MY_UDP_PORT: number;
	MY_TCP_PORT: number;
	OTHER_UDP_PORT: number;
	OTHER_TCP_PORT: number;
};

export const $receiverInfo = atom<InfoType>({
	MY_IP: '192.168.68.129', // FIXME: FIX Static
	BROADCAST_ADDR: '192.168.68.255', // FIXME: FIX Static
	MY_UDP_PORT: 9040,
	MY_TCP_PORT: 3040,
	OTHER_UDP_PORT: 9039,
	OTHER_TCP_PORT: 6969,
});
