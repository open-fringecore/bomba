import crypto from 'crypto';
import fs from 'fs';

const hashFile = filePath => {
	return new Promise((resolve, reject) => {
		const hash = crypto.createHash('sha256');
		const stream = fs.createReadStream(filePath);

		stream.on('data', chunk => {
			hash.update(chunk);
		});

		stream.on('end', () => {
			resolve(hash.digest('hex'));
		});

		stream.on('error', err => {
			reject(err);
		});
	});
};

// const filePath = 'D:\\Codings\\Works\\bomba\\send_files\\O.png';
// const filePath = 'D:\\Codings\\Works\\bomba\\receive_files\\sci-fi.png';
const filePath =
	'C:\\Users\\Rifat\\Downloads\\Mirzapur.S03.1080p.AMZN.WEB-DL.DDP5.1.H.264-GudduFTW\\Mirzapur.S03E01.Tetua.1080p.AMZN.WEB-DL.DDP5.1.H.264-GudduFTW.mkv';

hashFile(filePath)
	.then(hash => {
		console.log(`Hash of the file is: ${hash}`);
	})
	.catch(err => {
		console.error('Error hashing file:', err);
	});

// ! aa3dca97cfa3a77e4c7eee6f707f41672e06885506bf265e43519bbad2db622f
// ! 3427356e8dd33f5419e653a93fa33d5864a4ee91e348a0e38dda64245ece453c
// ! aa3dca97cfa3a77e4c7eee6f707f41672e06885506bf265e43519bbad2db622f
