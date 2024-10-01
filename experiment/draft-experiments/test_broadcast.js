import dgram from 'dgram';

// Create a UDP client
const client = dgram.createSocket('udp4');

const message = JSON.stringify({
	method: 'SELF',
	name: 'The Bugger',
	id: 'xxxxxxxxxxxxxxxxx',
	ip: 'fuck ip',
	httpPort: 1111,
});
const serverAddress = '0.0.0.0'; // Replace with the server's address if not running locally
const serverPort = 8008; // Replace with the server's port

// Send the message
client.send(message, serverPort, serverAddress, err => {
	if (err) {
		console.error('Error sending message:', err);
	} else {
		console.log('Message sent successfully!');
	}
	// Close the client after sending the message
	client.close();
});
