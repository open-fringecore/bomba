import fs from 'fs';
import path from 'path';

// fs.mkdirSync(myPath, {
// 	recursive: true,
// });

function createFile(filePath) {
	// Create the directory path if it doesn't exist
	const dir = path.dirname(filePath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, {recursive: true});
	}

	// Create an empty file
	fs.writeFile(filePath, '', err => {
		if (err) {
			console.error('Error creating file:', err);
		} else {
			console.log(`Empty file ${filePath} created successfully!`);
		}
	});
}

const myPath = `${process.cwd()}/random.txt`;
createFile(myPath);
