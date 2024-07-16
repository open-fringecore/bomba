import {deepMap} from 'nanostores';
import {v4 as uuidv4} from 'uuid';
import {getFreePort} from '../functions/freePort.js';

export type TransferStates =
	| 'DEFAULT'
	| 'TRANSFERRING'
	| 'TRANSFERRED'
	| 'ERROR'
	| 'SUCCESS';

export type SingleFilesInfo = {
	state: TransferStates;
	progress: number;
	fileName: string;
	fileSize: number;
	downloadedSize: number;
};
export type TransferFiles = {
	[fileID: string]: SingleFilesInfo;
};
export type SingleTransferInfo = {
	senderName: string;
	totalFiles: number;
	totalProgress: number;
	files: TransferFiles;
};
export type TransferInfoType = {
	[peerID: string]: SingleTransferInfo;
};

export const $transferInfo = deepMap<TransferInfoType>({});

export const updateTransferProgress = (
	peerID: string,
	fileID: string,
	info: SingleFilesInfo,
) => {
	// const currTransferData = $transferInfo.get();
	// $transferInfo.set({...currTransferData, [peerID]: newPeer});

	$transferInfo.setKey(`${peerID}.files.${fileID}`, {
		state: info.state,
		progress: info.progress,
		fileName: info.fileName,
		fileSize: info.fileSize,
		downloadedSize: info.downloadedSize,
	});
};

export const updateTransferInfoState = (
	peerID: string,
	fileID: string,
	state: TransferStates,
) => {
	$transferInfo.setKey(`${peerID}.files.${fileID}.state`, state);
};

export const removeSingleTransferInfo = (id: string) => {
	const currTransferInfo = $transferInfo.get();

	if (currTransferInfo.hasOwnProperty(id)) {
		const updatedInfo = {...currTransferInfo};
		delete updatedInfo[id];
		$transferInfo.set(updatedInfo);
	}
};
