const { broadcast } = require("./broadcast");
const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const BROADCAST_ADDR = "192.168.68.255";
const PORT = 12345;

const ackSend = (_IP, _PORT) => {
    const msg = {
        method: "SEND",
        name: "Mr. Thor",
    };
    broadcast(server, _IP, _PORT, JSON.stringify(msg));
};

server.bind(PORT);

server.on("listening", function () {
    const address = server.address();
    console.log(`SENDER listening on ${address.address}:${address.port}`);
});

server.on("message", (msg, rinfo) => {
    console.log(`Server received: ${msg} from ${rinfo.address}:${rinfo.port}`);
    const data = JSON.parse(msg);
    if (data?.method == "RECEIVE") {
        console.log(
            `Sending Acknowledgement to ${rinfo.address}:${rinfo.port}`
        );
        ackSend(rinfo.address, rinfo.port);
    }
});

server.on("error", (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});
