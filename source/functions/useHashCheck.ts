import crypto from 'crypto';
import fs from 'fs';
import {
	updateTransferFileErrorMsg,
	updateTransferFileState,
} from '@/stores/fileHandlerStore.js';

export const hashFile = (filePath: string) => {
	return new Promise((resolve, reject) => {
		const hash = crypto.createHash('sha256');
		const stream = fs.createReadStream(filePath);

		stream.on('data', chunk => {
			hash.update(chunk as any);
		});

		stream.on('end', () => {
			resolve(hash.digest('hex'));
		});

		stream.on('error', err => {
			reject(err);
		});
	});
};

export const useHashCheck = async (
	PEER_ID: string,
	PEER_IP: string,
	PEER_TCP_PORT: number,
	FILE_ID: string,
	FILENAME: string,
) => {
	return new Promise<void>(async (resolve, reject) => {
		try {
			const url = `http://${PEER_IP}:${PEER_TCP_PORT}/get-hash/${FILENAME}`;
			const outputPath = `${process.cwd()}/${FILENAME}`;
			// const outputPath = `${process.cwd()}/receive_files/${FILENAME}`; // TODO:: Fix

			const response = await fetch(url);
			if (!response.ok) {
				const errorData = await response.json();
				console.error(`Error: ${response.status} - ${errorData.msg}`);
				return;
			}
			const data = await response.json();

			const sendFileHash = data.hash;
			const receivedFileHash = await hashFile(outputPath);

			if (sendFileHash === receivedFileHash) {
				// log('HASH MATCHED');
				updateTransferFileState(FILE_ID, 'SUCCESS');
			} else {
				// log("HASH DIDN'T MATCHED", sendFileHash, receivedFileHash);
				// updateTransferFileState(FILE_ID, 'ERROR');
				// updateTransferFileErrorMsg(FILE_ID, 'Hash Mismatch.');
				throw new Error('Hash Mismatch.');
			}
			resolve();
		} catch (error) {
			let errMsg = 'Error hash check';
			if (error instanceof Error) {
				errMsg = error.message;
			}
			updateTransferFileState(FILE_ID, 'ERROR');
			updateTransferFileErrorMsg(FILE_ID, errMsg);
			reject(error);
			// console.error('Error hash check:', error);
		}
	});
};
