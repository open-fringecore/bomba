import {
	ReceiverTransferInfo,
	TransferFiles,
	TransferPeerInfo,
	Files,
	PeersFiles,
	TransferStates,
} from '@/types/storeTypes.js';
import {deepMap} from 'nanostores';

export const $peersFiles = deepMap<PeersFiles>({});
export const $receiverTransferInfo = deepMap<ReceiverTransferInfo>();

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
	$receiverTransferInfo.set({
		peerInfo: peerInfo,
		totalFiles: totalFiles,
		totalFileSize: totalFileSize,
		files: files,
	});
};

export const updateReceiverTransferProgress = (
	fileID: string,
	transferSize: number,
) => {
	const prevTransferred =
		$receiverTransferInfo.get().files[fileID]?.totalTransferred ?? 0;
	$receiverTransferInfo.setKey(
		`files.${fileID}.totalTransferred`,
		prevTransferred + transferSize,
	);
};

export const updateTransferFileState = (
	fileID: string,
	state: TransferStates,
) => {
	$receiverTransferInfo.setKey(`files.${fileID}.state`, state);
};

export const updateTransferFileErrorMsg = (fileID: string, error: string) => {
	$receiverTransferInfo.setKey(`files.${fileID}.errorMsg`, error);
};
