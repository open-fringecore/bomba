import fs from 'fs';
import tar from 'tar-stream';
import path from 'path';

// Function to download and extract tarball
const downloadAndExtractTar = async () => {
	try {
		const response = await fetch('http://localhost:3000/download-folder');

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const extract = tar.extract();
		const outputDir = path.join(process.cwd(), 'output-folder');

		// Ensure output directory exists
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir);
		}

		extract.on('entry', (header, stream, next) => {
			const filePath = path.join(outputDir, header.name);
			const writeStream = fs.createWriteStream(filePath);

			stream.pipe(writeStream);
			stream.on('end', () => {
				next(); // proceed to the next entry in the tar file
			});
		});

		extract.on('finish', () => {
			console.log('Tarball extraction complete.');
		});

		// Manually pipe the response body to the extractor
		for await (const chunk of response.body) {
			extract.write(chunk);
		}

		extract.end(); // End the extraction when streaming is done
	} catch (err) {
		console.error('Error downloading or extracting tarball:', err);
	}
};

downloadAndExtractTar();
