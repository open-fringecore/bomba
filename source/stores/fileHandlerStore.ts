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
export const $currTotalDownload = atom(0);
export const $currTransferProgress = map<CurrTransferProgress>();

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
			};
			return acc;
		},
		{},
	);

	const totalFileSize = Object.values(sendingFiles).reduce(
		(total, file) => total + file.fileSize,
		0,
	);

	$currTransfer.set({
		peerInfo: peerInfo,
		totalFiles: totalFiles,
		totalFileSize: totalFileSize,
		files: files,
	});
};

export const updateTotalDownloaded = (downloaded: number) => {
	const prev = $currTotalDownload.get();
	$currTotalDownload.set(prev + downloaded);
};
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
