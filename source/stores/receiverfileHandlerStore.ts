import {
	CurrTransfer,
	TransferFiles,
	TransferPeerInfo,
	Files,
	PeersFiles,
	SingleTransferFileInfo,
	TransferStates,
} from '@/types/storeTypes.js';
import {atom, deepMap, map} from 'nanostores';

export const $peersFiles = deepMap<PeersFiles>({});
export const $currTransfer = deepMap<CurrTransfer>();
export const $receiverTotalDownload = atom(0);

export const initReceiverTransferInfo = (
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

export const updateReceiverTransferProgress = (
	fileID: string,
	transferSize: number,
) => {
	const prevTransferred =
		$currTransfer.get().files[fileID]?.totalTransferred ?? 0;
	$currTransfer.setKey(
		`files.${fileID}.totalTransferred`,
		prevTransferred + transferSize,
	);
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
