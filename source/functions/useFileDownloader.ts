import express, {Request, Response} from 'express';
import path from 'path';
import http from 'http';
import fs from 'fs';
import {
	updateTransferFileError,
	updateTransferFileState,
	updateTransferProgress,
} from '../stores/fileHandlerStore.js';
import {v4 as uuidv4} from 'uuid';
import {CustomError} from './error.js';

// export const useFileDownloader = (
// 	PEER_IP: string | undefined,
// 	PEER_TCP_PORT: number,
// 	FILENAME: string,
// ) => {
// 	const url = `http://${PEER_IP}:${PEER_TCP_PORT}/download/${FILENAME}`;
// 	const outputPath = `${process.cwd()}/receive_files/${FILENAME}`;

// 	http
// 		.get(url, (res: any) => {
// 			const fileStream = fs.createWriteStream(outputPath);
// 			res.pipe(fileStream);

// 			// Listen for the end of the download
// 			fileStream.on('finish', () => {
// 				fileStream.close();
// 				console.log('Download completed.');
// 			});
// 		})
// 		.on('error', (err: any) => {
// 			console.error(`Error: ${err.message}`);
// 		});
// };

// TODO:: DELETE THIS FUNCTION
export const OLD_useFileDownloader = (
	PEER_ID: string,
	PEER_IP: string,
	PEER_TCP_PORT: number,
	FILE_ID: string,
	FILENAME: string,
): Promise<void> => {
	const url = `http://${PEER_IP}:${PEER_TCP_PORT}/download/${FILENAME}`;
	const outputPath = `${process.cwd()}/receive_files/${FILENAME}`; // TODO:: Fix

	// const FileID = uuidv4();
	let progress = 0;

	return new Promise<void>((resolve, reject) => {
		fetch(url)
			.then(res => {
				if (!res.ok) {
					if (res.status == 404) {
						throw new CustomError('Failed to download file', {
							code: res.status,
							detail: 'File not found!',
						});
					} else {
						throw new CustomError('Failed to download file', {
							code: res.status,
							detail: 'Failed to download file!',
						});
					}
				}

				const totalLength = parseInt(
					res.headers.get('content-length') || '0',
					10,
				);
				const writer = fs.createWriteStream(outputPath);
				let downloaded = 0;

				const reader = res.body!.getReader();

				const pump = async () => {
					try {
						const {done, value} = await reader.read();
						if (done) {
							writer.end();
							// console.log('File downloaded successfully.');
							resolve();
							return;
						}
						writer.write(value);
						downloaded += value.length;

						progress = parseFloat(
							((downloaded / totalLength) * 100).toFixed(2),
						);

						// console.log(`Progress: ${progress}%`);
						updateTransferProgress(FILE_ID, {
							state: progress < 100 ? 'TRANSFERRING' : 'TRANSFERRED',
							progress: progress,
							fileName: FILENAME,
							totalSize: totalLength,
							downloadedSize: downloaded,
						});
						pump();
					} catch (error) {
						writer.end();
						throw new CustomError('Failed to read file', {
							code: 410,
							detail: 'Failed to read file!',
						});
					}
				};

				pump();

				writer.on('error', () => {
					throw new CustomError('Failed to write file', {
						code: 410,
						detail: 'Failed to write file!',
					});
				});
			})
			.catch((err: CustomError) => {
				updateTransferFileState(FILE_ID, 'ERROR');
				updateTransferFileError(FILE_ID, err.data.detail);
				reject(err);
			});
	});
};

export const useFileDownloader = (
	PEER_ID: string,
	PEER_IP: string,
	PEER_TCP_PORT: number,
	FILE_ID: string,
	FILENAME: string,
): Promise<void> => {
	const url = `http://${PEER_IP}:${PEER_TCP_PORT}/download/${FILENAME}`;
	const outputPath = `${process.cwd()}/receive_files/${FILENAME}`; // TODO:: Fix

	return new Promise<void>(async (resolve, reject) => {
		try {
			const res = await fetch(url);
			if (!res.ok) {
				const errorMessage =
					res.status == 404 ? 'File not found!' : 'Failed to download file!';
				throw new CustomError('Failed to download file', {
					code: res.status,
					detail: errorMessage,
				});
			}

			const totalLength = parseInt(
				res.headers.get('content-length') || '0',
				10,
			);
			const writer = fs.createWriteStream(outputPath);
			let downloaded = 0;
			let progress = 0;

			const reader = res.body!.getReader();

			const pump = async () => {
				try {
					const {done, value} = await reader.read();
					if (done) {
						writer.end();
						resolve();
						return;
					}
					writer.write(value);
					downloaded += value.length;
					progress = parseFloat(((downloaded / totalLength) * 100).toFixed(2));

					updateTransferProgress(FILE_ID, {
						state: progress < 100 ? 'TRANSFERRING' : 'TRANSFERRED',
						progress: progress,
						fileName: FILENAME,
						totalSize: totalLength,
						downloadedSize: downloaded,
					});

					await pump();
				} catch (error) {
					writer.end();
					updateTransferFileState(FILE_ID, 'ERROR');
					updateTransferFileError(FILE_ID, '--------');
					reject(
						new CustomError('Failed to read file', {
							code: 410,
							detail: 'Failed to read file!',
						}),
					);
				}
			};

			writer.on('error', () => {
				reject(
					new CustomError('Failed to write file', {
						code: 410,
						detail: 'Failed to write file!',
					}),
				);
			});

			await pump();
		} catch (err) {
			if (err instanceof CustomError) {
				updateTransferFileState(FILE_ID, 'ERROR');
				updateTransferFileError(FILE_ID, err.data.detail);
			}
			reject(err);
		}
	});
};
