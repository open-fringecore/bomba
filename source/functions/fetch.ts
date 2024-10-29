import {log, logError} from '@/functions/log.js';

export const initSenderTransfer = async (
	baseUrl: string,
	senderPeerID: string,
): Promise<boolean> => {
	try {
		const url = `${baseUrl}/init-sender-transfer/${senderPeerID}`;
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
