import fs from 'fs';
import path from 'path';
import {
	updateTotalDownloaded,
	updateTransferFileErrorMsg,
	updateTransferFileState,
	updateTransferProgress,
} from '@/stores/fileHandlerStore.js';
import {RECEIVE_PATH, SEND_PATH} from '@/functions/variables.js';
import {useHashCheck} from '@/functions/useHashCheck.js';
import readlineSync from 'readline-sync';
import {log, logError} from '@/functions/log.js';
import {fileExists, getDiskSpace} from '@/functions/helper.js';
import {FileTypes} from '@/types/storeTypes.js';
import {pipeline, Readable} from 'stream';
import {promisify} from 'util';
import {ReadableStream} from 'stream/web';
// import {default as tarFs} from 'tar-fs';
import {x as extract} from 'tar';
import {fetchUpdateSenderTransferState} from '@/functions/fetch.js';

const pipelineAsync = promisify(pipeline);

export const checkDuplication = (
	FILE_ID: string,
	fileName: string,
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		try {
			const isDuplicate = fileExists(`${RECEIVE_PATH}/${fileName}`);
			if (isDuplicate) {
				if (
					readlineSync.keyInYN(
						'File already exists. Do you want to replace it?',
					)
				) {
					resolve(true);
				} else {
					updateTransferFileState(FILE_ID, 'ERROR');
					updateTransferFileErrorMsg(FILE_ID, 'File already exist!');
					resolve(false);
				}
			} else {
				resolve(true);
			}
		} catch (error) {
			reject(error);
		}
	});
};
export const checkEnoughSpace = (
	FILE_ID: string,
	fileSize: number,
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		try {
			const availableSpace = await getDiskSpace();
			const isNotEnoughSpace = fileSize > availableSpace;
			if (isNotEnoughSpace) {
				updateTransferFileState(FILE_ID, 'ERROR');
				updateTransferFileErrorMsg(FILE_ID, 'Not enough space!');
				resolve(false);
			} else {
				resolve(true);
			}
		} catch (error) {
			reject(error);
		}
	});
};

const extractTar = async (tarFileName: string): Promise<void> => {
	const tarPath = path.join(RECEIVE_PATH, tarFileName);
	const folderName = tarFileName.replace('.tar', '');
	const extractDir = path.join(RECEIVE_PATH, folderName);

	try {
		await fs.promises.mkdir(extractDir, {recursive: true});

		await extract({
			file: tarPath,
			C: extractDir,
		});

		log('Extraction complete');
	} catch (err) {
		console.error('Error extracting tar file:', err);
	}
};

const deleteTar = async (tarFileName: string) => {
	const tarPath = path.join(RECEIVE_PATH, tarFileName);
	try {
		await fs.unlinkSync(tarPath);
		log(`File deleted successfully: ${tarPath}`);
	} catch (error) {
		logError(`Error deleting file: ${error}`);
		// throw error;
	}
};

export const useFileDownloader = async (
	MY_ID: string,
	PEER_IP: string,
	PEER_TCP_PORT: number,
	FILE_ID: string,
	FILENAME: string,
	FILETYPE: FileTypes,
	FILESIZE: number,
): Promise<void> => {
	const downloadUrlForNormalFile = `http://${PEER_IP}:${PEER_TCP_PORT}/download/${MY_ID}/${FILE_ID}`;
	const downloadUrlForTar = `http://${PEER_IP}:${PEER_TCP_PORT}/download-tar/${MY_ID}/${FILE_ID}`;

	const isFolder = FILETYPE == 'folder';
	const saveFileAs = isFolder ? `${FILENAME}.tar` : FILENAME;
	const url = isFolder ? downloadUrlForTar : downloadUrlForNormalFile;

	const outputPath = path.join(RECEIVE_PATH, saveFileAs);

	try {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(
				res.status === 404 ? 'File not found!' : 'Failed to download file!',
			);
		}

		const dir = path.dirname(outputPath);
		await fs.promises.mkdir(dir, {recursive: true});

		// const totalLength = parseInt(res.headers.get('content-length') || '0', 10);
		const totalLength = FILESIZE;

		let downloaded = 0;
		let progress = 0;

		const reader = Readable.fromWeb(res.body! as ReadableStream);
		const writer = fs.createWriteStream(outputPath);

		reader.on('data', chunk => {
			downloaded += chunk.length;
			const progress = Math.min(
				parseFloat(((downloaded / totalLength) * 100).toFixed(2)),
				100,
			);

			updateTotalDownloaded(chunk.length);
			updateTransferProgress(FILE_ID, progress);
			updateTransferFileState(
				FILE_ID,
				progress < 100 ? 'TRANSFERRING' : 'TRANSFERRED',
			);
		});

		await pipelineAsync(reader, writer);

		if (isFolder) {
			await extractTar(saveFileAs);
			await deleteTar(saveFileAs);
		}

		// writer.on('finish', () => {
		// 	log('File writing completed.');
		// 	updateTransferFileState(FILE_ID, 'TRANSFERRED');
		// });
	} catch (error) {
		logError(error);
		const errMsg = error instanceof Error ? error.message : 'Unknown error';
		updateTransferFileState(FILE_ID, 'ERROR');
		updateTransferFileErrorMsg(FILE_ID, errMsg);

		await fetchUpdateSenderTransferState(
			PEER_IP,
			PEER_TCP_PORT,
			'ERROR',
			errMsg,
		);

		throw error;
	}
};
