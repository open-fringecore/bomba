const dgram = require("dgram");
const client = dgram.createSocket("udp4");

const PORT = 12345;

client.on("listening", function () {
    const address = client.address();
    console.log(`UDP Client listening on ${address.address}:${address.port}`);
    client.setBroadcast(true);
});

const sendersIPs = [];

client.on("message", function (message, remote) {
    // console.log(
    //     `Received message from ${remote.address}:${remote.port} - ${message}`
    // );

    const msg = JSON.parse(message);
    if (!sendersIPs.includes(msg.ip)) {
        sendersIPs.push(msg.ip);
        console.log("Received message from: ", msg.name);
    }
});

setTimeout(() => {
    console.log("❌ 5 Seconds up, closing connection. ❌");
    client.close();
}, 5000);

client.bind(PORT);
