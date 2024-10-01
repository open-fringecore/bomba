// client.js
const http = require('http');
const fs = require('fs');
const path = require('path');

// Define the file URL and the destination file path
const fileUrl = 'http://localhost:3000/download';
const destinationPath = path.join(__dirname, 'downloaded_file.txt');

// Make the HTTP request to download the file
http
	.get(fileUrl, res => {
		if (res.statusCode !== 200) {
			console.error(`Failed to download file: ${res.statusCode}`);
			res.resume(); // Consume response to free up memory
			return;
		}

		// Create a writable stream to save the file
		const writeStream = fs.createWriteStream(destinationPath);

		// Pipe the response stream to the writable stream
		res.pipe(writeStream);

		// Handle finish event when the file is completely written
		writeStream.on('finish', () => {
			console.log('File downloaded and saved successfully!');
		});

		// Handle errors during the file download process
		writeStream.on('error', err => {
			console.error('Error writing the file:', err);
		});
	})
	.on('error', err => {
		console.error(`Request error: ${err.message}`);
	});
