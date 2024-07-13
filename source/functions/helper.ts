export function getRandomBanglaName() {
	const names = [
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

	const randomIndex = Math.floor(Math.random() * names.length);

	return names[randomIndex];
}

export const hasNullValue = (obj: {[key: string]: any}): boolean => {
	return Object.values(obj).some(value => value === null);
};

export const cleanFileName = (name: string) => {
	return name.replace(/[\\/]/g, '').replace(/^\./, '');
};

// TODO:: Fix
export const getFileSize = (fileName: string) => {
	return 99999;
};
