import React, {useMemo} from 'react';
import {Box, Text} from 'ink';

type PropType = {
	left?: number;
	percent: number;
	title: string;
};
const emptyCharacter = '⠀';
const fillCharacter = '█';
const remainCharacter = '░';
const ProgressBar = ({left = 0, percent, title}: PropType) => {
	const fill = useMemo(() => Math.floor(percent / 5), [percent]);
	const remain = useMemo(() => Math.ceil((100 - percent) / 5), [percent]);

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
