import {deepMap} from 'nanostores';
import {v4 as uuidv4} from 'uuid';
import {getFreePort} from '../functions/freePort.js';

export type SingleTransferInfo = {
	[fileID: string]: {
		progress: number;
		fileName: string;
		fileSize: number;
		downloadedSize: number;
	};
};
export type TransferInfoType = {
	[peerID: string]: SingleTransferInfo;
};

export const $transferInfo = deepMap<TransferInfoType>({});

export const updateTransferProgress = (
	peerID: string,
	fileID: string,
	info: {
		progress: number;
		fileName: string;
		fileSize: number;
		downloadedSize: number;
	},
) => {
	// const currTransferData = $transferInfo.get();
	// $transferInfo.set({...currTransferData, [peerID]: newPeer});

	$transferInfo.setKey(`${peerID}.${fileID}`, {
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
