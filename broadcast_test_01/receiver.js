const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const port = 41234; // The port number should match the one used for broadcasting

server.on("error", (err) => {
    console.log(`Server error:\n${err.stack}`);
    server.close();
});

server.on("message", (msg, rinfo) => {
    console.log(`Server received: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on("listening", () => {
    const address = server.address();
    console.log(`Server listening ${address.address}:${address.port}`);
});

// Bind the server to the port (and optionally, to a specific IP)
server.bind(port);
// Optionally, you could specify a network interface to listen on specific IPs:
// server.bind(port, '192.168.1.x');
