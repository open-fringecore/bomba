// client.js
import http from 'http';
import fs from 'fs';
import path from 'path';

// Define the file URL and the destination file path
const fileUrl = 'http://localhost:3000/download';
const destinationPath = path.join(process.cwd(), 'downloaded_file.png');

// Make the HTTP request to download the file
http
	.get(fileUrl, res => {
		if (res.statusCode !== 200) {
			console.error(`Failed to download file: ${res.statusCode}`);
			res.resume(); // Consume response to free up memory
			return;
		}

		const totalSize = parseInt(res.headers['content-length'], 10); // Total file size from headers
		let receivedBytes = 0; // Bytes received so far

		// Create a writable stream to save the file
		const writeStream = fs.createWriteStream(destinationPath);

		// Pipe the response stream to the writable stream
		res.pipe(writeStream);

		// Track progress as the file is being received
		res.on('data', chunk => {
			receivedBytes += chunk.length;
			const progress = ((receivedBytes / totalSize) * 100).toFixed(2);
			console.log(`Client: ${progress}% downloaded`);
		});

		// Handle finish event when the file is completely written
		writeStream.on('finish', () => {
			console.log('Client: File downloaded and saved successfully!');
		});

		// Handle errors during the file download process
		writeStream.on('error', err => {
			console.error('Error writing the file:', err);
		});
	})
	.on('error', err => {
		console.error(`Request error: ${err.message}`);
	});
