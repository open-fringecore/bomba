import {FileTypes} from '@/types/storeTypes.js';

export const peoplesNames = [
	'অনিক',
	'বৃষ্টি',
	'চৈতি',
	'দীপন',
	'এলিনা',
	'ফাহিম',
	'গার্গী',
	'হৃদয়',
	'ইমরান',
	'জাহিদ',
];

export const fileTypeMapping: {[key: string]: FileTypes} = {
	// Image file extensions
	'.jpg': 'image',
	'.jpeg': 'image',
	'.png': 'image',
	'.gif': 'image',
	'.bmp': 'image',
	'.svg': 'image',
	// Video file extensions
	'.mp4': 'video',
	'.avi': 'video',
	'.mov': 'video',
	'.mpeg': 'video',
	'.wmv': 'video',
	// Text file extensions
	'.txt': 'text',
	'.md': 'text',
	'.csv': 'text',
	'.json': 'text',
};
