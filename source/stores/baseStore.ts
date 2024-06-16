import {atom} from 'nanostores';
import {v4 as uuidv4} from 'uuid';
import {getFreePort} from '../functions/freePort.js';

type InfoType = {
	MY_ID: string;
	MY_IP: string | null;
	MY_NAME: string | null;
	BROADCAST_ADDR: string | null;
	UDP_PORT: number;
	HTTP_PORT: number;
};

export const $baseInfo = atom<InfoType>({
	MY_ID: uuidv4(),
	MY_IP: null,
	MY_NAME: null,
	BROADCAST_ADDR: null,
	UDP_PORT: 5544,
	HTTP_PORT: (await getFreePort()) ?? 8779,
});

export const $action = atom<'SEND' | 'RECEIVE' | 'NOTHING'>('NOTHING');
export const $sendingFiles = atom<string[] | null>(null);
