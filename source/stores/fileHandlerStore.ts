import {deepMap} from 'nanostores';

export type TransferStates =
	| 'DEFAULT'
	| 'TRANSFERRING'
	| 'TRANSFERRED'
	| 'ERROR'
	| 'SUCCESS';

export type SingleTransferFileInfo = {
	state: TransferStates;
	errorMsg?: string;
	progress: number;
	fileName: string;
	totalSize: number;
	downloadedSize: number;
};
type CurrTransferFiles = {
	[fileID: string]: SingleTransferFileInfo;
};
export type CurrTransfer = {
	peerID: string;
	senderName: string;
	totalFiles: number;
	totalProgress: number;
	files: CurrTransferFiles;
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

export const initTransferInfo = (
	peerID: string,
	senderName: string,
	totalFiles: number,
	sendingFiles: Files,
) => {
	const files = Object.entries(sendingFiles)?.reduce(
		(acc: CurrTransferFiles, [key, value]) => {
			acc[key] = {
				state: 'DEFAULT',
				progress: 0,
				fileName: value.fileName,
				totalSize: value.fileSize,
				downloadedSize: 0,
			};
			return acc;
		},
		{},
	);
	$currTransfer.set({
		peerID: peerID,
		senderName: senderName,
		totalFiles: totalFiles,
		totalProgress: 0,
		files: files,
	});
};

export const updateTransferProgress = (
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

export const updateTransferFileState = (
	fileID: string,
	state: TransferStates,
) => {
	$currTransfer.setKey(`files.${fileID}.state`, state);
};

export const updateTransferFileErrorMsg = (fileID: string, error: string) => {
	$currTransfer.setKey(`files.${fileID}.errorMsg`, error);
};
