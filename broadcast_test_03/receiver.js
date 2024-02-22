const { broadcast } = require("./broadcast");
const dgram = require("dgram");
const net = require("net");
const server = dgram.createSocket("udp4");

const BROADCAST_ADDR = "192.168.68.255";
const SENDER_PORT = 9039;
const MY_PORT = 9040;

server.bind(MY_PORT);

// ! Initial Broadcast
const initialBroadcast = () => {
    const msg = {
        method: "RECEIVE",
        name: "Mr. Zeus",
    };
    broadcast(server, BROADCAST_ADDR, SENDER_PORT, JSON.stringify(msg));
};
initialBroadcast();

const sendTCPAck = (_IP, _PORT) => {};

server.on("listening", function () {
    const address = server.address();
    console.log(`UDP Client listening on ${address.address}:${address.port}`);
    server.setBroadcast(true);
});

server.on("message", function (message, remote) {
    console.log(
        `← Received message from ${remote.address}:${remote.port} - ${message}`
    );

    const data = JSON.parse(message);
    if (data?.method == "SEND") {
        console.log(
            `→ → Sending TCP Acknowledgement to ${remote.address}:${remote.port}`
        );
        sendTCPAck(remote.address, remote.port);
    }
});
