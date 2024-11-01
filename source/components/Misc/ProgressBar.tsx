import React, {useMemo} from 'react';
import {Box, Text} from 'ink';

type TProps = {
	left?: number;
	percent: number;
	title?: string;
};
const emptyCharacter = '⠀';
const fillCharacter = '█';
const remainCharacter = '░';
const ProgressBar = ({left = 0, percent, title}: TProps) => {
	const unitSize = 5;
	const fill = useMemo(() => Math.floor(percent / unitSize), [percent]);
	const remain = useMemo(
		() => Math.ceil((100 - percent) / unitSize),
		[percent],
	);

	return (
		<Text>
			{[...Array(left)]?.map(() => emptyCharacter)}
			{[...Array(fill)]?.map(() => fillCharacter)}
			{[...Array(remain)]?.map(() => remainCharacter)}
			{emptyCharacter}
			{title}
		</Text>
	);
};

export default ProgressBar;
