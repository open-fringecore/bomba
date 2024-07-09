import express, {Request, Response} from 'express';
import path from 'path';
import http from 'http';
import fs from 'fs';

export const useFileDownloader = (
	MY_IP: string | undefined,
	OTHER_TCP_PORT: number,
	FILENAME: string,
) => {
	const url = `http://${MY_IP}:${OTHER_TCP_PORT}/download/${FILENAME}`;
	const path = `${process.cwd()}/receive_files/${FILENAME}`;

	http
		.get(url, (res: any) => {
			const fileStream = fs.createWriteStream(path);
			res.pipe(fileStream);

			// Listen for the end of the download
			fileStream.on('finish', () => {
				fileStream.close();
				console.log('Download completed.');
			});
		})
		.on('error', (err: any) => {
			console.error(`Error: ${err.message}`);
		});
};
