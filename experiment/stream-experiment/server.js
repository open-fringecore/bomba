// server.js
import http from 'http';
import fs from 'fs';
import path from 'path';

// Create the server
const server = http.createServer((req, res) => {
	const filePath = path.join(process.cwd(), 'send-wires.png'); // The file to serve

	if (req.url === '/download') {
		fs.stat(filePath, (err, stats) => {
			if (err) {
				console.error('Error getting file stats:', err);
				res.writeHead(500, 'Internal Server Error');
				res.end('Error reading the file');
				return;
			}

			const totalSize = stats.size; // Total file size in bytes
			let transferredBytes = 0; // Bytes transferred so far

			const readStream = fs.createReadStream(filePath);

			// Set headers for the file download
			res.writeHead(200, {
				'Content-Type': 'application/octet-stream',
				'Content-Disposition': 'attachment; filename="send-wires.png"',
				'Content-Length': totalSize,
			});

			// Pipe the file stream to the HTTP response
			readStream.pipe(res);

			// Track progress as the file is being read
			readStream.on('data', chunk => {
				transferredBytes += chunk.length;
				const progress = ((transferredBytes / totalSize) * 100).toFixed(2);
				console.log(`Server: ${progress}% transferred`);
			});

			readStream.on('end', () => {
				console.log('Server: File transfer completed.');
			});

			readStream.on('error', err => {
				console.error('Error reading the file:', err);
				res.writeHead(500, 'Internal Server Error');
				res.end('Error during file transfer');
			});
		});
	} else {
		// Handle other routes
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end('Resource not found');
	}
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
