import crypto, {BinaryLike} from 'crypto';
import path from 'path';
import fs from 'fs';
import {
	updateTransferFileErrorMsg,
	updateTransferFileState,
} from '@/stores/fileHandlerStore.js';
import {RECEIVE_PATH} from '@/functions/variables.js';
import {log, logError} from '@/functions/log.js';

export const hashFile = async (filePath: string) => {
	return new Promise((resolve, reject) => {
		const hash = crypto.createHash('sha256');

		const stream = fs.createReadStream(filePath);

		stream.on('data', chunk => {
			hash.update(chunk as any);
		});

		stream.on('end', () => {
			resolve(hash.digest('hex'));
		});

		stream.on('error', error => {
			logError(error);
			reject(error);
		});
	});
};

export const hashFolder = async (folderPath: string) => {
	const hash = crypto.createHash('sha256');
	try {
		const files = fs.readdirSync(folderPath);

		for (const file of files) {
			const filePath = path.join(folderPath, file);
			const stats = fs.statSync(filePath);

			if (stats.isDirectory()) {
				const subFolderHash = await hashFolder(filePath);
				hash.update(subFolderHash);
			} else {
				const fileHash = await hashFile(filePath);
				hash.update(fileHash as unknown as BinaryLike);
			}
		}
	} catch (error) {
		console.log('first', error);
	}
	return hash.digest('hex');
};

export const useHashCheck = async (
	PEER_IP: string,
	PEER_TCP_PORT: number,
	FILE_ID: string,
	FILENAME: string,
) => {
	log('Hash checking:', FILENAME);
	try {
		const url = `http://${PEER_IP}:${PEER_TCP_PORT}/get-hash/${FILENAME}`;
		const outputPath = path.join(RECEIVE_PATH, FILENAME);

		const response = await fetch(url);
		if (!response.ok) {
			const errorText = await response.text();
			logError(`Error: ${response.status} - ${errorText}`);
			throw new Error(`Fetch failed with status ${response.status}`);
		}

		const data = await response.json();

		const sendFileHash = data.hash;
		const stats = fs.statSync(outputPath);

		const receivedFileHash = stats.isDirectory()
			? await hashFolder(outputPath)
			: await hashFile(outputPath);

		if (sendFileHash === receivedFileHash) {
			log('HASH MATCHED');
			updateTransferFileState(FILE_ID, 'SUCCESS');
		} else {
			log("HASH DIDN'T MATCH", sendFileHash, receivedFileHash);
			throw new Error('Hash Mismatch.');
		}
	} catch (error) {
		let errMsg = 'Error during hash check';
		if (error instanceof Error) {
			errMsg = error.message;
		}
		updateTransferFileState(FILE_ID, 'ERROR');
		updateTransferFileErrorMsg(FILE_ID, errMsg);
		logError('Error during hash check:', error);
		throw error;
	}
};
