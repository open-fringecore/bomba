import {logError} from '@/functions/log.js';

export const initSenderTransfer = async (
	baseUrl: string,
	senderPeerID: string,
): Promise<boolean> => {
	try {
		const url = `${baseUrl}/init-transfer/${senderPeerID}`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			logError('Error:', errorData.msg);
			return false;
		}

		const data = await response.json();
		console.log(data.msg);

		return true;
	} catch (error) {
		console.error('Fetch error:', error);
		return false;
	}
};
