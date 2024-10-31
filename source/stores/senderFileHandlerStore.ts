import {log} from '@/functions/log.js';
import {$sendingFiles} from '@/stores/baseStore.js';
import {$connectedPeers} from '@/stores/peersStore.js';
import {
	SenderSinglePeerTransferInfo,
	SenderTransferInfo,
} from '@/types/storeTypes.js';
import {deepMap} from 'nanostores';

export const $senderTransferInfo = deepMap<SenderTransferInfo>();

export const updateTransferredAmount = (
	peerID: string,
	transferSize: number,
) => {
	const prevTransferred =
		$senderTransferInfo.get()[peerID]?.totalTransferred ?? 0;
	$senderTransferInfo.setKey(
		`${peerID}.totalTransferred`,
		prevTransferred + transferSize,
	);
};

export const addToSenderTransferInfo = (
	peerID: string,
	newTransferInfo: SenderSinglePeerTransferInfo,
) => {
	const prevTransferInfo = $senderTransferInfo.get();
	const updatedTransferInfo = {...prevTransferInfo, [peerID]: newTransferInfo};
	$senderTransferInfo.set(updatedTransferInfo);
};

export const initSenderTransfer = (peerID: string) => {
	const sendingFiles = $sendingFiles.get();
	const connectedPeers = $connectedPeers.get();
	const selectedPeer = connectedPeers[peerID];

	if (!selectedPeer) {
		return log('⭕ Selected Peer not found ⭕', peerID);
	}
	if (!sendingFiles) {
		return log('⭕ No sending files found ⭕');
	}

	// const selectedPeerFiles = Object.fromEntries(
	// 	Object.entries(sendingFiles).map(([fileId, fileInfo]) => [
	// 		fileId,
	// 		{fileId, ...fileInfo},
	// 	]),
	// );

	const totalFiles = Object.entries(sendingFiles).length;

	const totalFileSize = Object.values(sendingFiles).reduce(
		(total, file) => total + file.fileSize,
		0,
	);

	const newTransferInfo: SenderSinglePeerTransferInfo = {
		state: 'DEFAULT',
		peerInfo: {
			peerID: peerID,
			peerIP: selectedPeer.ip,
			peerHttpPort: selectedPeer.httpPort,
			peerName: selectedPeer.name,
		},
		totalFiles: totalFiles,
		totalFileSize: totalFileSize,
		totalTransferred: 0,
	};

	addToSenderTransferInfo(peerID, newTransferInfo);
};
