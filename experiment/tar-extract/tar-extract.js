import fs from 'fs';
// import tar from 'tar-fs';
import {x} from 'tar';

const tarPath = '/home/rifat/Works/bomba/experiment/tar-extract/lily.tar';
const extractDir = '/home/rifat/Works/bomba/experiment/tar-extract';

// const extractTar = async () => {

// 	try {
// 		fs.createReadStream(tarPath).pipe(tar.extract(extractDir));
// 	} catch (error) {
// 		console.log(`Error extracting tar: ${error}`);
// 		throw error;
// 	}
// };

// extractTar();

x({
	file: tarPath,
	C: extractDir,
})
	.then(() => {
		console.log('Extraction complete');
	})
	.catch(err => {
		console.error('Error extracting tar file:', err);
	});
