import express, {Request, Response} from 'express';
import path from 'path';

export const useFileDownloader = (filePath: string) => {
	const app = express();
	const PORT = 3333;

	app.get('/download', (req: Request, res: Response) => {
		res.download(filePath, 'BRAIN.jpg', (err: any) => {
			if (err) {
				console.error('Error downloading the file:', err);
				if (!res.headersSent) {
					res.status(500).send('Error downloading the file');
				}
			}
		});
	});

	app.listen(PORT, '192.168.68.204', () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
};
