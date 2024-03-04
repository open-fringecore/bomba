import express, {Request, Response} from 'express';
import path from 'path';

export const useFileDownloadServer = (
	MY_IP: string,
	MY_TCP_PORT: number,
	filePath: string,
) => {
	const app = express();

	app.get('/download', (req: Request, res: Response) => {
		console.log('filePath', filePath);
		res.download(filePath, 'BRAIN.jpg', (err: any) => {
			if (err) {
				console.error('Error downloading the file:', err);
				if (!res.headersSent) {
					res.status(500).send('Error downloading the file');
				}
			}
		});
	});

	app.listen(MY_TCP_PORT, MY_IP, () => {
		console.log(`Server is running on http://localhost:${MY_TCP_PORT}`);
	});
};
