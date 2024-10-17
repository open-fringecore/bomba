import http from 'http';
import fs from 'fs';
import path from 'path';
// import pump from 'pump';
import {c} from 'tar';

const server = http.createServer((req, res) => {
	if (req.url === '/download') {
		res.setHeader('Content-Type', 'application/x-tar');
		res.setHeader('Content-Disposition', 'attachment; filename="archive.tar"');

		const folderPath = path.join(process.cwd(), 'folder-to-send');

		const pack = c(
			{
				C: folderPath,
			},
			[''],
		);

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
	} else {
		res.statusCode = 404;
		res.end('Not Found');
	}
});

server.listen(3000, () => {
	console.log('Server running on http://localhost:3000/download');
});

process.on('uncaughtException', err => {
	console.error('Uncaught Exception:', err);
	process.exit(1);
});
