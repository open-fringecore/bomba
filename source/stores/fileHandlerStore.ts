import {
	CurrTransfer,
	CurrTransferFiles,
	CurrTransferPeerInfo,
	CurrTransferProgress,
	Files,
	PeersFiles,
	SingleTransferFileInfo,
	TransferStates,
} from '@/types/storeTypes.js';
import {atom, deepMap, map} from 'nanostores';

export const $peersFiles = deepMap<PeersFiles>({});
export const $currTransfer = deepMap<CurrTransfer>();
export const $currTransferProgress = map<CurrTransferProgress>();
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
				fileName: value.fileName,
				fileType: value.fileType,
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

// export const updateTransferProgress = (
// 	fileID: string,
// 	data: SingleTransferFileInfo & {
// 		progress: number;
// 	},
// ) => {
// 	$currTransfer.setKey(`files.${fileID}`, {
// 		state: data.state,
// 		fileName: data.fileName,
// 		totalSize: data.totalSize,
// 		downloadedSize: data.downloadedSize,
// 	});

// 	$currTransferProgress.setKey(fileID, data.progress);
// };
export const updateTransferProgress = (fileID: string, progress: number) => {
	$currTransferProgress.setKey(fileID, progress);
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
