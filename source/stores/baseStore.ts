import {atom, map} from 'nanostores';
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

export const $baseInfo = map<InfoType>({
	MY_ID: uuidv4(),
	MY_IP: null,
	MY_NAME: null,
	BROADCAST_ADDR: null,
	UDP_PORT: 8008,
	HTTP_PORT: (await getFreePort()) ?? 8779,
});

export const $action = atom<'SEND' | 'RECEIVE' | 'NOTHING'>('NOTHING');

export type SingleSendingFile = {
	fileName: string;
	fileSize: number;
};
export type SendingFiles = {
	[fileID: string]: SingleSendingFile;
};
export const $sendingFiles = atom<SendingFiles | null>(null);
