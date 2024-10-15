import fs from 'fs';
import https from 'http';

const fileUrl = 'http://192.168.68.129:42089/download-tar/lily';
// const fileUrl = 'http://localhost:3000/download';

const outputPath = './downloaded-file.tar';

const file = fs.createWriteStream(outputPath);

https.get(fileUrl, response => {
	const totalSize = parseInt(response.headers['content-length'], 10);
	let downloadedSize = 0;

	console.log(`Total file size: ${totalSize}`);

	response.on('data', chunk => {
		downloadedSize += chunk.length;
		const progress = ((downloadedSize / totalSize) * 100).toFixed(2);
		console.log(`Progress: ${progress}%\r`);
	});

	response.pipe(file);

	file.on('finish', () => {
		console.log('\nDownload complete!');
		file.close();
	});

	response.on('error', err => {
		console.error('Download failed:', err.message);
	});
});
