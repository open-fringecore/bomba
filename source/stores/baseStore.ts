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
	HTTP_PORT: 8119,
});

export type UserType = {
	ip: string;
	name: string;
	port: number;
};
export const $users = atom<UserType[]>([
	{
		ip: 'xxxxxxxx',
		name: 'Ghost',
		port: 8008,
	},
	{
		ip: 'yyyyyyy',
		name: 'Spawn',
		port: 8008,
	},
]);
