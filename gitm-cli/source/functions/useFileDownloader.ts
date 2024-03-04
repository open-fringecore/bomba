import express, {Request, Response} from 'express';
import path from 'path';

export const useFileDownloader = (
	MY_IP: string | undefined,
	OTHER_TCP_PORT: number,
) => {
	const url = `http://${MY_IP}:${OTHER_TCP_PORT}/download`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			console.log(data);
		})
		.catch(error => {
			console.error('Error:', error);
		});
};
