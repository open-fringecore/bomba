import http from 'http';
import fs from 'fs';
import path from 'path';
import tar from 'tar-fs';

// Function to stream a folder as a tarball
const streamFolderAsTar = (folderPath, res, totalBytes) => {
	try {
		// tar.pack(folderPath).pipe(res);

		tar
			.pack(folderPath)
			.pipe(res)
			.on('data', () => {
				console.log('-');
			})
			.on('finish', () => {
				console.log('Tarball has been sent.');
			})
			.on('error', err => {
				console.error('Error creating tarball:', err);
				res.writeHead(500, {'Content-Type': 'text/plain'});
				res.end('Internal Server Error');
			});
	} catch (error) {
		console.log('ERROR:: ' + error);
	}
};

// Create an HTTP server | http://localhost:3000/download-folder
http
	.createServer((req, res) => {
		if (req.url === '/download-folder') {
			const folderPath = path.join(process.cwd(), 'folder-to-send');

			/// Calculate the total size of the files to be tarred
			const totalSize = 9999;

			// Set headers for the response, including Content-Length
			res.writeHead(200, {
				'Content-Type': 'application/x-tar',
				'Content-Disposition': 'attachment; filename="folder.tar"',
				'Content-Length': totalSize, // Send total size as Content-Length
			});

			// Stream the folder as a tarball
			streamFolderAsTar(folderPath, res, totalSize);
		} else {
			res.writeHead(404);
			res.end('Not Found');
		}
	})
	.listen(3000, () => {
		console.log('Server running on http://localhost:3000');
	});

process.on('uncaughtException', err => {
	console.error('Uncaught Exception:', err);
	process.exit(1);
});

// tar.pack('./folder-to-send').pipe(fs.createWriteStream('my-tarball.tar'));
