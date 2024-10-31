import {log, logError} from '@/functions/log.js';

export const fetchInitSenderTransfer = async (
	baseUrl: string,
	MY_ID: string,
): Promise<boolean> => {
	try {
		const url = `${baseUrl}/init-sender-transfer/${MY_ID}`;
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

export const fetchOnTransferComplete = async (
	baseUrl: string,
	MY_ID: string,
): Promise<boolean> => {
	try {
		const url = `${baseUrl}/on-transfer-complete/${MY_ID}`;
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
