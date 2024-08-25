import {Socket} from 'dgram'; // Ensure dgram is available in your environment
import {log} from '@/functions/log.js';

const useBroadcast = () => {
	const broadcast = (
		server: Socket,
		ADDRESS: string,
		PORT: number,
		msg: string,
	): void => {
		const MESSAGE: Buffer = Buffer.from(msg);

		server.send(
			MESSAGE,
			0,
			MESSAGE.length,
			PORT,
			ADDRESS,
			(err: Error | null): void => {
				if (err) throw err;
				// log(`Broadcast sent to ${ADDRESS}:${PORT}`);
				// server.close();
			},
		);
	};

	return {broadcast};
};

export default useBroadcast;
