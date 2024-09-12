// ! BaseStore
export type InfoType = {
	MY_ID: string;
	MY_IP: string | null;
	MY_NAME: string | null;
	BROADCAST_ADDR: string | null;
	UDP_PORT: number;
	HTTP_PORT: number;
};
export type SingleSendingFile = {
	fileName: string;
	fileSize: number;
};
export type SendingFiles = {
	[fileID: string]: SingleSendingFile;
};

// ! PeersStore
export type DiscoveredPeerType = {
	id: string;
	ip: string;
	name: string;
	httpPort: number;
};
export type DiscoveredPeersType = {
	[key: string]: DiscoveredPeerType;
};
export type ConnectedPeerType = {
	id: string;
	ip: string;
	name: string;
	isSending: boolean;
	httpPort: number;
};
export type ConnectedPeersType = {
	[key: string]: ConnectedPeerType;
};

// ! FileHandlerStore
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
export type CurrTransferFiles = {
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
