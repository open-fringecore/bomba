const dgram = require("dgram");
const socket = dgram.createSocket("udp4"); // 'udp4' for IPv4

// Enable broadcasting
socket.bind(function () {
    socket.setBroadcast(true);
});

const message = Buffer.from("Your broadcast message here");
const port = 41234; // The port on which you want to broadcast

// Replace with your subnet's broadcast address
const IP = "192.168.1.255"; // Docker IP
// const IP = "192.168.68.204" // Local IP
const broadcastAddress = IP;

socket.send(message, 0, message.length, port, broadcastAddress, function (err) {
    if (err) throw err;
    console.log("UDP message sent to " + broadcastAddress + ":" + port);
    socket.close();
});
