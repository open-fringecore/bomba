// ! BaseStore
export type InfoType = {
	MY_ID: string;
	MY_IP: string | null;
	MY_NAME: string | null;
	BROADCAST_ADDR: string | null;
	UDP_PORT: number;
	HTTP_PORT: number;
};
export type FileTypes = 'image' | 'video' | 'text' | 'folder' | 'others';
export type SingleSendingFile = {
	fileName: string;
	fileSize: number;
	fileType: FileTypes;
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
	[peerID: string]: DiscoveredPeerType;
};
export type ConnectedPeerType = {
	id: string;
	ip: string;
	name: string;
	isSending: boolean;
	httpPort: number;
};
export type ConnectedPeersType = {
	[peerID: string]: ConnectedPeerType;
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
	fileName: string;
	fileType: FileTypes;
	totalSize: number;
};
export type ReceiverTransferProgress = {
	[fileID: string]: number;
};
export type TransferFiles = {
	[fileID: string]: SingleTransferFileInfo;
};
export type TransferPeerInfo = {
	peerID: string;
	peerIP: string;
	peerHttpPort: number;
	peerName: string;
};
export type CurrTransfer = {
	peerInfo: TransferPeerInfo;
	totalFiles: number;
	totalFileSize: number;
	files: TransferFiles;
};

export type SingleFile = {
	fileId: string;
	fileName: string;
	fileSize: number;
	fileType: FileTypes;
};

export type Files = {
	[fileID: string]: SingleFile;
};
export type PeersFiles = {
	[peerID: string]: Files;
};

// ! SenderFileHandlerStore
export type SenderSinglePeerTransferInfo = {
	state: TransferStates;
	errorMsg?: string;
	peerInfo: TransferPeerInfo;
	totalFiles: number;
	totalFileSize: number;
	totalTransferred: number;
};
export type SenderTransferInfo = {
	[peerID: string]: SenderSinglePeerTransferInfo;
};
