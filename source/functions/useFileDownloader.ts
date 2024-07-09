import express, {Request, Response} from 'express';
import path from 'path';
import http from 'http';
import fs from 'fs';

// export const useFileDownloader = (
// 	MY_IP: string | undefined,
// 	OTHER_TCP_PORT: number,
// 	FILENAME: string,
// ) => {
// 	const url = `http://${MY_IP}:${OTHER_TCP_PORT}/download/${FILENAME}`;
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

export const useFileDownloader = (
	MY_IP: string | undefined,
	OTHER_TCP_PORT: number,
	FILENAME: string,
): Promise<void> => {
	const url = `http://${MY_IP}:${OTHER_TCP_PORT}/download/${FILENAME}`;
	const outputPath = `${process.cwd()}/receive_files/${FILENAME}`;

	return new Promise<void>((resolve, reject) => {
		fetch(url)
			.then(res => {
				if (!res.ok) {
					throw new Error(`Failed to download file, status ${res.status}`);
				}

				const totalLength = parseInt(
					res.headers.get('content-length') || '0',
					10,
				);
				const writer = fs.createWriteStream(outputPath);
				let downloaded = 0;

				const reader = res.body!.getReader();

				const pump = async () => {
					const {done, value} = await reader.read();
					if (done) {
						writer.end();
						console.log('File downloaded successfully.');
						resolve(); // Resolve the promise when download completes
						return;
					}
					writer.write(value);
					downloaded += value.length;
					console.log(
						`Progress: ${((downloaded / totalLength) * 100).toFixed(2)}%`,
					);
					pump();
				};

				pump();

				writer.on('error', reject); // Handle writer errors
			})
			.catch(err => {
				reject(err); // Forward fetch errors
			});
	});
};
