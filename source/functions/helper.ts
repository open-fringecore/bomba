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
