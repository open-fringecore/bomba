import {deepMap} from 'nanostores';
import {v4 as uuidv4} from 'uuid';
import {getFreePort} from '../functions/freePort.js';

type TransferInfoType = {
	[peerID: string]: {
		[fileID: string]: {
			progress: number;
			// fileName: string;
			// fileSize: number;
			// downloadedSize: number;
		};
	};
};

export const $transferInfo = deepMap<TransferInfoType>({});

export const updateTransferProgress = (
	peerID: string,
	fileID: string,
	progress: number,
) => {
	// const currTransferData = $transferInfo.get();
	// $transferInfo.set({...currTransferData, [peerID]: newPeer});

	$transferInfo.setKey(`${peerID}.${fileID}.progress`, progress);
};
