import http from 'http';
import fs from 'fs';
import path from 'path';
import tar from 'tar-stream';

// Helper function to calculate the total size of files in a folder
const calculateTotalSize = folderPath => {
	let totalSize = 0;
	const files = fs.readdirSync(folderPath);
	files.forEach(file => {
		const filePath = path.join(folderPath, file);
		const stat = fs.statSync(filePath);
		if (stat.isFile()) {
			totalSize += stat.size; // Add file size to total
		}
	});
	return totalSize;
};

// Function to stream a folder as a tarball
const streamFolderAsTar = (folderPath, res, totalBytes) => {
	const pack = tar.pack(); // Create a tar pack stream
	let transferredBytes = 0; // Track progress

	fs.readdir(folderPath, (err, files) => {
		if (err) {
			console.error('Error reading directory:', err);
			res.statusCode = 500;
			return res.end('Error reading directory');
		}

		files.forEach(file => {
			const filePath = path.join(folderPath, file);
			const stat = fs.statSync(filePath);

			if (stat.isFile()) {
				const readStream = fs.createReadStream(filePath);
				const tarHeader = {
					name: file, // name inside the tar
					size: stat.size,
					mode: stat.mode,
					mtime: stat.mtime,
				};

				// Create a new entry in the tarball
				const entry = pack.entry(tarHeader, err => {
					if (err) {
						console.error('Error creating tar entry:', err);
					}
				});

				// Track how much data is being streamed
				readStream.on('data', chunk => {
					transferredBytes += chunk.length;
					const progress = ((transferredBytes / totalBytes) * 100).toFixed(2);
					console.log(`Progress: ${progress}%`);
				});

				// Pipe the file content into the entry
				readStream.pipe(entry);

				readStream.on('end', () => {
					entry.end(); // Signal that we’re done with this entry
				});
			}
		});

		// Once all files are added, finalize the tar stream
		pack.finalize();
	});

	// Pipe the tar pack to the response
	pack.pipe(res);
};

// Create an HTTP server
http
	.createServer((req, res) => {
		if (req.url === '/download-folder') {
			const folderPath = path.join(process.cwd(), 'folder-to-send');

			/// Calculate the total size of the files to be tarred
			const totalSize = calculateTotalSize(folderPath);

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
