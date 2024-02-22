// FileA.js - TCP Server
const net = require("net");
const server = net.createServer((socket) => {
    console.log("Client connected.");

    socket.on("data", (data) => {
        console.log("Data received from client:", data.toString());
        socket.write("👍👍👍 SENDING FILE HERE 👍👍👍");
    });

    socket.on("end", () => {
        console.log("Client disconnected.");
    });
});

const PORT = 6000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
