const { broadcast } = require("./broadcast");
const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const BROADCAST_ADDR = "192.168.68.255";
const BROADCAST_PORT = 12345;
const PORT = 9999;

server.bind(PORT);

// ! Initial Broadcast
const initialBroadcast = () => {
    const msg = {
        method: "RECEIVE",
        name: "Mr. Zeus",
    };
    broadcast(server, BROADCAST_ADDR, BROADCAST_PORT, JSON.stringify(msg));
};
initialBroadcast();

server.on("listening", function () {
    const address = server.address();
    console.log(`UDP Client listening on ${address.address}:${address.port}`);
    server.setBroadcast(true);
});

server.on("message", function (message, remote) {
    console.log(
        `Received message from ${remote.address}:${remote.port} - ${message}`
    );
});
