import {useStore} from '@nanostores/react';
import * as os from 'os';
import {useEffect} from 'react';
import {$baseInfo} from '@/stores/baseStore.js';

const isPrivateIP = (ip: string): boolean => {
	return ip.startsWith('192.168');
};

const calculateBroadcastAddress = (ipAddress: string, subnetMask: string) => {
	const ipBinary = ipAddress
		.split('.')
		.map(part => parseInt(part, 10).toString(2).padStart(8, '0'))
		.join('');
	const maskBinary = subnetMask
		.split('.')
		.map(part => parseInt(part, 10).toString(2).padStart(8, '0'))
		.join('');

	const broadcastBinary = ipBinary
		.split('')
		.map((bit, index) => parseInt(bit, 2) | (maskBinary[index] === '0' ? 1 : 0))
		.join('');

	const broadcastParts = [];
	for (let i = 0; i < 4; i++) {
		broadcastParts.push(parseInt(broadcastBinary.substr(i * 8, 8), 2));
	}
	return broadcastParts.join('.');
};

const getLocalIP = (): {
	address: string | null;
	subnetMask: string | null;
	addresses: string[];
} => {
	const interfaces = os.networkInterfaces();
	const addresses: string[] = [];
	let address = null;
	let subnetMask = null;

	for (const iface in interfaces) {
		for (const details of interfaces[iface]!) {
			if (details.family === 'IPv4' && !details.internal) {
				addresses.push(details.address);
				if (isPrivateIP(details.address)) {
					address = details.address;
					subnetMask = details.netmask;
				}
			}
		}
	}

	return {
		address,
		subnetMask,
		addresses,
	};
};

const useLocalIP = () => {
	useEffect(() => {
		const {address, subnetMask} = getLocalIP();

		if (address && subnetMask) {
			const broadcastAddress = calculateBroadcastAddress(address, subnetMask);

			$baseInfo.set({
				...$baseInfo.get(),
				MY_IP: address,
				BROADCAST_ADDR: broadcastAddress,
			});
		}
	}, []);

	return;
};

export default useLocalIP;
