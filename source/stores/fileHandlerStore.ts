import {
	CurrTransfer,
	TransferFiles,
	TransferPeerInfo,
	ReceiverTransferProgress,
	Files,
	PeersFiles,
	SingleTransferFileInfo,
	TransferStates,
} from '@/types/storeTypes.js';
import {atom, deepMap, map} from 'nanostores';

export const $peersFiles = deepMap<PeersFiles>({});
export const $currTransfer = deepMap<CurrTransfer>();
export const $receiverTotalDownload = atom(0);
export const $receiverTransferProgress = map<ReceiverTransferProgress>();

export const initTransferInfo = (
	peerInfo: TransferPeerInfo,
	totalFiles: number,
	sendingFiles: Files,
) => {
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

	const totalFileSize = Object.values(sendingFiles).reduce(
		(total, file) => total + file.fileSize,
		0,
	);

	// TODO:: Return
	$currTransfer.set({
		peerInfo: peerInfo,
		totalFiles: totalFiles,
		totalFileSize: totalFileSize,
		files: files,
	});
};

export const updateTotalDownloaded = (downloaded: number) => {
	const prev = $receiverTotalDownload.get();
	$receiverTotalDownload.set(prev + downloaded);
};
export const updateTransferProgress = (fileID: string, progress: number) => {
	$receiverTransferProgress.setKey(fileID, progress);
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
