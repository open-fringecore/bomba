import {atom, deepMap, map} from 'nanostores';

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
export type CurrTransferPeerInfo = {
	peerID: string;
	peerIP: string;
	peerHttpPort: number;
	senderName: string;
};
export type CurrTransfer = {
	peerInfo: CurrTransferPeerInfo;
	totalFiles: number;
	totalProgress: number;
	files: CurrTransferFiles;
};

export type SingleFile = {
	fileId: string;
	fileName: string;
	fileSize: number;
};

export type Files = {
	[fileID: string]: SingleFile;
};
export type PeersFiles = {
	[peerID: string]: Files;
};

// export type CurrTransferWarningType = {
// 	fileID: string;
// 	msg: string;
// };

export const $peersFiles = deepMap<PeersFiles>({});
export const $currTransfer = deepMap<CurrTransfer>();
// export const $currTransferWarning = map<CurrTransferWarningType>();

export const initTransferInfo = (
	peerInfo: CurrTransferPeerInfo,
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
		peerInfo: peerInfo,
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
