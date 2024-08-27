import * as fs from 'fs';
import * as path from 'path';

const getAllFiles = (dirPath, arrayOfFiles = []) => {
	const files = fs.readdirSync(dirPath);

	files.forEach(file => {
		const fullPath = path.join(dirPath, file);
		if (fs.statSync(fullPath).isDirectory()) {
			arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
		} else {
			arrayOfFiles.push(fullPath);
		}
	});

	return arrayOfFiles;
};

const folderPath = '/home/rifat/Works/bomba/send_files/aaa.png'; // replace with your folder path
const files = getAllFiles(folderPath);

console.log(files);
