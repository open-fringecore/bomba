const net = require("net");
const fs = require("fs");

function magic(file = "./sender/file.jpg") {
    let server,
        istream = fs.createReadStream(file);

    server = net.createServer((socket) => {
        socket.pipe(process.stdout);
        istream.on("readable", function () {
            let data;
            while ((data = this.read())) {
                socket.write(data);
            }
        });
        istream.on("end", function () {
            socket.end();
        });
        socket.on("end", () => {
            server.close(() => {
                console.log("\nTransfer is done!");
            });
        });
    });

    server.listen(8000, "192.168.0.107");
}

magic();
