import fs from 'fs';
import path from 'path';

const downloadFileWithProgress = (url, outputPath) => {
	return new Promise((resolve, reject) => {
		fetch(url)
			.then(res => {
				if (!res.ok) {
					throw new Error(`Failed to download file, status ${res.status}`);
				}

				const totalLength = parseInt(res.headers.get('content-length'), 10);
				const writer = fs.createWriteStream(outputPath);
				let downloaded = 0;

				const reader = res.body.getReader();

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

// Example usage:
const fileUrl = 'http://192.168.0.104:50646/download/sci-fi.png';
const outputFilePath = path.join(process.cwd(), 'downloadedFile.png');

downloadFileWithProgress(fileUrl, outputFilePath)
	.then(() => {
		console.log('Download completed successfully.');
	})
	.catch(err => {
		console.error('Error downloading file:', err);
	});
