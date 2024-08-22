import express, {Request, Response} from 'express';
import path from 'path';
import http from 'http';
import fs from 'fs';
import {
	updateTransferFileErrorMsg,
	updateTransferFileState,
	updateTransferProgress,
} from '@/stores/fileHandlerStore.js';
import {v4 as uuidv4} from 'uuid';

export const useFileDownloader = (
	PEER_ID: string,
	PEER_IP: string,
	PEER_TCP_PORT: number,
	FILE_ID: string,
	FILENAME: string,
): Promise<void> => {
	const url = `http://${PEER_IP}:${PEER_TCP_PORT}/download/${FILENAME}`;
	const outputPath = `${process.cwd()}/${FILENAME}`;
	// const outputPath = `${process.cwd()}/receive_files/${FILENAME}`; // TODO:: Fix

	return new Promise<void>(async (resolve, reject) => {
		try {
			const res = await fetch(url);
			if (!res.ok) {
				throw new Error(
					res.status == 404 ? 'File not found!!!' : 'Failed to download file!',
				);
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
					updateTransferFileErrorMsg(FILE_ID, 'Failed to read file!');
					reject(new Error('Failed to read file'));
				}
			};

			writer.on('error', () => {
				reject(new Error('Failed to write file'));
			});

			await pump();
		} catch (error) {
			let errMsg = '';
			if (error instanceof Error) {
				errMsg = error.message;
			}
			updateTransferFileState(FILE_ID, 'ERROR');
			updateTransferFileErrorMsg(FILE_ID, errMsg);
			reject(error);
		}
	});
};
