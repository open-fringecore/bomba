const fs = require("fs");
const path = require("path");

// Source and destination file paths
const sourcePath = path.join(__dirname, "ac_video.mkv");
const destPath = path.join(__dirname, "ac_video_copied.mkv");

// Get the size of the source file
fs.stat(sourcePath, (err, stats) => {
    if (err) {
        console.error("Error reading file stats:", err);
        return;
    }

    const totalSize = stats.size;
    let copiedSize = 0;

    // Create read and write streams
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destPath);

    // Pipe the read stream to the write stream
    readStream.pipe(writeStream);

    // Listen for 'data' events to track progress
    readStream.on("data", (chunk) => {
        copiedSize += chunk.length;
        const progress = (copiedSize / totalSize) * 100;
        console.log(`Progress: ${progress.toFixed(2)}%`);
    });

    // Handle errors
    readStream.on("error", (err) => {
        console.error("Error reading file:", err);
    });

    writeStream.on("error", (err) => {
        console.error("Error writing file:", err);
    });

    // Notify when copying is complete
    writeStream.on("finish", () => {
        console.log("File copy completed successfully.");
    });
});
