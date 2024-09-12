import {
	CurrTransfer,
	CurrTransferFiles,
	CurrTransferPeerInfo,
	Files,
	PeersFiles,
	SingleTransferFileInfo,
	TransferStates,
} from '@/types/storeTypes.js';
import {atom, deepMap, map} from 'nanostores';

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
