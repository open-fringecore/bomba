import {atom} from 'nanostores';

type InfoType = {
	MY_IP: string | null;
	MY_NAME: string | null;
	BROADCAST_ADDR: string | null;
	MY_UDP_PORT: number;
};

export const $baseInfo = atom<InfoType>({
	MY_IP: null,
	MY_NAME: null,
	BROADCAST_ADDR: null,
	MY_UDP_PORT: 9039,
});
