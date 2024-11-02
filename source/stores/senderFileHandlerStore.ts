import {log} from '@/functions/log.js';
import {$sendingFiles} from '@/stores/baseStore.js';
import {$connectedPeers} from '@/stores/peersStore.js';
import {
	SenderSinglePeerTransferInfo,
	SenderTransferInfo,
	TransferFiles,
	TransferStates,
} from '@/types/storeTypes.js';
import {deepMap} from 'nanostores';

export const $senderTransferInfo = deepMap<SenderTransferInfo>();

export const updateSenderTransferProgress = (
	peerID: string,
	fileID: string,
	transferSize: number,
) => {
	const prevTransferred =
		$senderTransferInfo.get()[peerID]?.files[fileID]?.totalTransferred ?? 0;
	$senderTransferInfo.setKey(
		`${peerID}.files.${fileID}.totalTransferred`,
		prevTransferred + transferSize,
	);
};

export const updateSenderTransferState = (
	peerID: string,
	fileID: string,
	state: TransferStates,
) => {
	$senderTransferInfo.setKey(`${peerID}.files.${fileID}.state`, state);
};

export const updateSenderTransferError = (
	peerID: string,
	fileID: string,
	error: string,
) => {
	$senderTransferInfo.setKey(`${peerID}.files.${fileID}.errorMsg`, error);
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

	const files = Object.entries(sendingFiles)?.reduce(
		(acc: TransferFiles, [key, value]) => {
			acc[key] = {
				state: 'DEFAULT',
				fileName: value.fileName,
				fileType: value.fileType,
				totalSize: value.fileSize,
				totalTransferred: 0,
			};
			return acc;
		},
		{},
	);

	const totalFiles = Object.entries(sendingFiles).length;

	const totalFileSize = Object.values(sendingFiles).reduce(
		(total, file) => total + file.fileSize,
		0,
	);

	// TODO:: Return
	const newTransferInfo: SenderSinglePeerTransferInfo = {
		peerInfo: {
			peerID: peerID,
			peerIP: selectedPeer.ip,
			peerHttpPort: selectedPeer.httpPort,
			peerName: selectedPeer.name,
		},
		totalFiles: totalFiles,
		totalFileSize: totalFileSize,
		files: files,
	};

	addToSenderTransferInfo(peerID, newTransferInfo);
};
