import dgram from 'dgram';
const PORT = 8008; // Replace with the port you are listening on
const BROADCAST_ADDR = '192.168.68.255'; // Broadcast address

// Create a socket
const server = dgram.createSocket('udp4');

// Event listener for incoming messages
server.on('message', (message, rinfo) => {
	console.log(`Server got: ${message} from ${rinfo.address}:${rinfo.port}`);

	const rdata = JSON.parse(message?.toString());

	const data = {
		name: 'John Doe',
		ip: '192.168.68.161',
		port: rdata.httpPort,
	};

	const url = `http://${rinfo.address}:${rdata.httpPort}/discover`;
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then(response => response.json())
		.then(data => {
			console.log(data);
		})
		.catch(error => {
			console.error('Error:', error);
		});
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
