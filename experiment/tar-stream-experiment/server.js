// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create the server
const server = http.createServer((req, res) => {
	const filePath = path.join(__dirname, 'file.txt'); // The file to serve

	// Check if the request is for the file
	if (req.url === '/download') {
		// Create a read stream for the file
		const readStream = fs.createReadStream(filePath);

		// Set headers for the file download
		res.writeHead(200, {
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': 'attachment; filename="file.txt"',
		});

		// Pipe the file stream to the HTTP response
		readStream.pipe(res);

		// Handle errors during reading
		readStream.on('error', err => {
			console.error('Error reading the file:', err);
			res.writeHead(500, 'Internal Server Error');
			res.end('File not found or error occurred.');
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
