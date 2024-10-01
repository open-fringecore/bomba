import http from 'http';
import fs from 'fs';
import path from 'path';
import tar from 'tar-stream';

// Function to stream a folder as a tarball
const streamFolderAsTar = (folderPath, res) => {
	const pack = tar.pack(); // create a pack stream

	fs.readdir(folderPath, (err, files) => {
		if (err) {
			console.error('Error reading directory:', err);
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

				pack.entry(tarHeader, (err, entry) => {
					if (err) throw err;
					readStream.pipe(entry);
				});
			}
		});

		// End the pack stream when done
		pack.finalize();

		// Pipe the tar stream to the response
		pack.pipe(res);
	});
};

// Create an HTTP server
http
	.createServer((req, res) => {
		if (req.url === '/download-folder') {
			const folderPath = path.join(process.cwd(), 'folder-to-send');
			res.writeHead(200, {
				'Content-Type': 'application/x-tar',
				'Content-Disposition': 'attachment; filename="folder.tar"',
			});
			streamFolderAsTar(folderPath, res);
		} else {
			res.writeHead(404);
			res.end('Not Found');
		}
	})
	.listen(3000, () => {
		console.log('Server running on http://localhost:3000');
	});
