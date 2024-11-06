import {atom, map} from 'nanostores';
import {v4 as uuidv4} from 'uuid';
import {getFreePort} from '@/functions/freePort.js';
import {InfoType, SendingFiles} from '@/types/storeTypes.js';

export const $baseInfo = map<InfoType>({
	MY_ID: uuidv4(),
	MY_IP: null,
	MY_NAME: null,
	BROADCAST_ADDR: null,
	UDP_PORT: 8008,
	HTTP_PORT: (await getFreePort()) ?? 8779,
});

export const $action = atom<'SEND' | 'RECEIVE' | 'NOTHING'>('NOTHING');
export const $isDev = atom<boolean>(false);
export const $errorMsg = atom<string | undefined>();

export const $sendingFiles = atom<SendingFiles>({});
