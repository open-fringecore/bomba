import {log, logError} from '@/functions/log.js';
import {$baseInfo} from '@/stores/baseStore.js';
import {TransferStates} from '@/types/storeTypes.js';

export const fetchInitSenderTransfer = async (
	peerIP: string,
	peerHttpPort: number,
	MY_ID: string,
): Promise<boolean> => {
	try {
		const url = `http://${peerIP}:${peerHttpPort}/init-sender-transfer/${MY_ID}`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			logError(errorData);
			return false;
		}

		const data = await response.json();
		log(data.msg);

		return true;
	} catch (error) {
		logError(error);
		return false;
	}
};

// ! As a receiver, tell the sender about transfer state.
export const fetchUpdateSenderTransferState = async (
	peerIP: string,
	peerHttpPort: number,
	state: TransferStates,
	error?: string,
): Promise<boolean> => {
	const MY_ID = $baseInfo.get().MY_ID;

	try {
		const url = `http://${peerIP}:${peerHttpPort}/update-sender-transfer-state/${MY_ID}/${state}?error=${
			error ?? undefined
		}`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			logError(errorData);
			return false;
		}

		const data = await response.json();
		log(data.msg);

		return true;
	} catch (error) {
		logError(error);
		return false;
	}
};
