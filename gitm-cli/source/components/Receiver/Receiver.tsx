import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import {Spinner} from '../Misc/Spinner.js';
import dgram from 'dgram';
import useBroadcast from '../../functions/broadcast.js';
import express, {Request, Response} from 'express';
import {useFileDownloader} from '../../functions/useFileDownloader.js';
import {useReceiverTcpServer} from '../../functions/receiverTcpServer.js';
import {useReceiverUdpServer} from '../../functions/receiverUdpServer.js';

const MY_IP = '192.168.0.105'; // FIXME: FIX Static
const BROADCAST_ADDR = '192.168.0.255'; // FIXME: FIX Static
const MY_UDP_PORT = 9040;
const MY_TCP_PORT = 3040;
const OTHER_UDP_PORT = 9039;
const OTHER_TCP_PORT = 6969;

const Receiver = () => {
	const [isReceiving, setIsReceiving] = useState(false);

	useReceiverTcpServer(MY_IP, MY_TCP_PORT, OTHER_TCP_PORT);
	useReceiverUdpServer(
		BROADCAST_ADDR,
		MY_UDP_PORT,
		OTHER_UDP_PORT,
		OTHER_TCP_PORT,
		isReceiving,
		setIsReceiving,
	);

	return (
		<Box flexDirection="column">
			{isReceiving && (
				<Text>
					<Spinner /> Receiving
				</Text>
			)}
			{/* <SenderList /> */}
		</Box>
	);
};

export default Receiver;
