import {useStore} from '@nanostores/react';
import * as os from 'os';
import {useEffect, useState} from 'react';
import {$baseInfo} from '../stores/baseStore.js';

function isPrivateIP(ip: string): boolean {
	return ip.startsWith('192.168');
}

export const getLocalIP = (): {
	address: string | null;
	addresses: string[];
} => {
	const interfaces = os.networkInterfaces();
	const addresses: string[] = [];
	let address = null;

	for (const iface in interfaces) {
		for (const details of interfaces[iface]!) {
			if (details.family === 'IPv4' && !details.internal) {
				addresses.push(details.address);
				if (isPrivateIP(details.address)) {
					address = details.address;
				}
			}
		}
	}

	return {
		address,
		addresses,
	};
};

const useLocalIP = () => {
	useEffect(() => {
		const {address} = getLocalIP();

		$baseInfo.set({...$baseInfo.get(), MY_IP: address});
	}, []);

	return;
};

export default useLocalIP;
