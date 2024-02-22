// FileB.js - TCP Client
const net = require("net");
const client = new net.Socket();
const PORT = 6000;
const HOST = "127.0.0.1"; // Use the appropriate host, localhost for this example

client.connect(PORT, HOST, () => {
    console.log("Connected to server");

    // Send a message to the server
    client.write("Hello, this is FileB!");
});

client.on("data", (data) => {
    console.log("Received:", data.toString());
    client.end(); // close the connection after receiving the response
});

client.on("close", () => {
    console.log("Connection closed");
});
