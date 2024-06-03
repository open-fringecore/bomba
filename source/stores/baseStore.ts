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

export type UserType = {
	ip: string;
	name: string;
};
export const $users = atom<UserType[]>([
	{
		name: 'Ghost',
		ip: 'xxxxxxxx',
	},
	{
		name: 'Spawn',
		ip: 'yyyyyyy',
	},
]);

export const addUser = (newUser: UserType) => {
	const currentUsers = $users.get();

	const isUserAlreadyExist = currentUsers?.find(item => item.ip == newUser.ip);

	if (isUserAlreadyExist) {
		return false;
	}

	$users.set([...currentUsers, newUser]);
	return true;
};
