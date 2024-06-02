import dgram from 'dgram';
const PORT = 8008; // Replace with the port you are listening on
const BROADCAST_ADDR = '192.168.68.255'; // Broadcast address

// Create a socket
const server = dgram.createSocket('udp4');

// Event listener for incoming messages
server.on('message', (message, rinfo) => {
	console.log(`Server got: ${message} from ${rinfo.address}:${rinfo.port}`);
});

// Bind to the port and address
server.bind(PORT, () => {
	server.setBroadcast(true);
	console.log(`Server listening on port ${PORT}`);
});

// Error handling
server.on('error', err => {
	console.log(`Server error:\n${err.stack}`);
	server.close();
});
