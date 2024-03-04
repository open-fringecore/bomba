import express, {Request, Response} from 'express';
import path from 'path';
import http from 'http';
import fs from 'fs';

export const useFileDownloader = (
	MY_IP: string | undefined,
	OTHER_TCP_PORT: number,
) => {
	const url = `http://${MY_IP}:${OTHER_TCP_PORT}/download`;
	const path = '/home/rifat/Works/gitm/gitm-cli/receive_files/test.jpg';

	// fetch(url)
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		console.log(data);
	// 	})
	// 	.catch(error => {
	// 		console.error('Error:', error);
	// 	});

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
