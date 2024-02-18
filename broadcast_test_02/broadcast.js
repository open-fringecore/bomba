const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const BROADCAST_ADDR = "192.168.0.255";
const PORT = 12345;

const broadcast = (msg) => {
    const MESSAGE = Buffer.from(msg);

    server.bind(function () {
        server.setBroadcast(true);

        setInterval(() => {
            server.send(
                MESSAGE,
                0,
                MESSAGE.length,
                PORT,
                BROADCAST_ADDR,
                function (err) {
                    if (err) throw err;
                    console.log(
                        "UDP message sent to " + BROADCAST_ADDR + ":" + PORT
                    );
                }
            );
        }, 500);
    });

    server.on("listening", function () {
        const address = server.address();
        console.log(
            `UDP Server listening on ${address.address}:${address.port}`
        );
    });

    server.on("error", (err) => {
        console.log(`server error:\n${err.stack}`);
        server.close();
    });
};

module.exports = {
    broadcast,
};
