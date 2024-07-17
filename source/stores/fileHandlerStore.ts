import {deepMap} from 'nanostores';
import {v4 as uuidv4} from 'uuid';
import {getFreePort} from '../functions/freePort.js';

export type TransferStates =
	| 'DEFAULT'
	| 'TRANSFERRING'
	| 'TRANSFERRED'
	| 'ERROR'
	| 'SUCCESS';

export type SingleTransferFileInfo = {
	state: TransferStates;
	progress: number;
	fileName: string;
	totalSize: number;
	downloadedSize: number;
};
export type CurrTransfer = {
	peerID: string;
	senderName: string;
	totalFiles: number;
	totalProgress: number;
	files: {
		[fileID: string]: SingleTransferFileInfo;
	};
};

export type Files = {
	[fileID: string]: {
		fileName: string;
		fileSize: number;
	};
};
export type PeersFiles = {
	[peerID: string]: Files;
};

export const $peersFiles = deepMap<PeersFiles>({});
export const $currTransfer = deepMap<CurrTransfer>();

export const updateTransferProgress = (
	peerID: string,
	fileID: string,
	data: SingleTransferFileInfo,
) => {
	$currTransfer.setKey(`files.${fileID}`, {
		state: data.state,
		progress: data.progress,
		fileName: data.fileName,
		totalSize: data.totalSize,
		downloadedSize: data.downloadedSize,
	});
};

export const updateTransferInfoState = (
	peerID: string,
	fileID: string,
	state: TransferStates,
) => {
	$currTransfer.setKey(`files.${fileID}.state`, state);
};
