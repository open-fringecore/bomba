import http from 'http';
import fs from 'fs';
import path from 'path';
// import pump from 'pump';
import tar from 'tar-fs';

const server = http.createServer((req, res) => {
	if (req.url === '/download') {
		res.setHeader('Content-Type', 'application/x-tar');
		res.setHeader('Content-Disposition', 'attachment; filename="archive.tar"');

		const folderPath = path.join(process.cwd(), 'folder-to-send');

		const pack = tar.pack(folderPath);

		pack.on('error', err => {
			console.error('Pack stream error:', err);
		});

		res.on('error', err => {
			console.error('Response stream error:', err);
		});

		res.on('close', () => {
			console.log('Response stream closed');
		});

		pack.on('data', chunk => {
			console.log(chunk);
		});

		pack.pipe(res);

		// pump(pack, res, err => {
		// 	if (err) {
		// 		console.error('Pump error:', err);
		// 		if (!res.headersSent) {
		// 			res.statusCode = 500;
		// 			res.end('Internal Server Error');
		// 		}
		// 	}
		// });
	} else {
		res.statusCode = 404;
		res.end('Not Found');
	}
});

server.listen(3000, () => {
	console.log('Server running on http://localhost:3000');
});

process.on('uncaughtException', err => {
	console.error('Uncaught Exception:', err);
	process.exit(1);
});
