import {deepMap} from 'nanostores';
import {v4 as uuidv4} from 'uuid';
import {getFreePort} from '../functions/freePort.js';

export type TransferStates = 'DEFAULT' | 'TRANSFERRING' | 'ERROR' | 'SUCCESS';

export type SingleTransferInfo = {
	state: TransferStates;
	progress: number;
	fileName: string;
	fileSize: number;
	downloadedSize: number;
};
export type SinglePeerTransferInfo = {
	[fileID: string]: SingleTransferInfo;
};
export type TransferInfoType = {
	[peerID: string]: SinglePeerTransferInfo;
};

export const $transferInfo = deepMap<TransferInfoType>({});

export const updateTransferProgress = (
	peerID: string,
	fileID: string,
	info: SingleTransferInfo,
) => {
	// const currTransferData = $transferInfo.get();
	// $transferInfo.set({...currTransferData, [peerID]: newPeer});

	$transferInfo.setKey(`${peerID}.${fileID}`, {
		state: info.state,
		progress: info.progress,
		fileName: info.fileName,
		fileSize: info.fileSize,
		downloadedSize: info.downloadedSize,
	});
};

export const removeSingleTransferInfo = (id: string) => {
	const currTransferInfo = $transferInfo.get();

	if (currTransferInfo.hasOwnProperty(id)) {
		const updatedInfo = {...currTransferInfo};
		delete updatedInfo[id];
		$transferInfo.set(updatedInfo);
	}
};
