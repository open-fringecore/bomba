const net = require("net")
const fs = require("fs")

let socket;

function magic() {
    socket = net.connect(8000, '192.168.0.107')

    let ostream = fs.createWriteStream("./file.png");
    let date = new Date(),
        size = 0,
        elapsed;
    socket.on('data', chunk => {
        size += chunk.length;
        elapsed = new Date() - date;
        socket.write(`\r${(size / (1024 * 1024)).toFixed(2)} MB of data was sent. Total elapsed time is ${elapsed / 1000} s`)
        process.stdout.write(`\r${(size / (1024 * 1024)).toFixed(2)} MB of data was sent. Total elapsed time is ${elapsed / 1000} s`);
        ostream.write(chunk);
    });
    socket.on("end", () => {
        console.log(`\nFinished getting file. speed was: ${((size / (1024 * 1024)) / (elapsed / 1000)).toFixed(2)} MB/s`);
        process.exit();
    });
}

magic()