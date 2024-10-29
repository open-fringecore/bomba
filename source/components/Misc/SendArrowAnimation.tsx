import React, {useState, useEffect} from 'react';
import {Text, render} from 'ink';

export const arrowCharacters = {
	plane: '✈',
	triangle: '▶',
	bullet: '➤',
};

type PropType = {
	arrow?: string;
	speed?: number;
};
const SendArrowAnimation = ({
	arrow = arrowCharacters.triangle,
	speed = 50,
}: PropType) => {
	const [indentLevel, setIndentLevel] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setIndentLevel(prevLevel => (prevLevel + 1) % 10);
		}, speed);

		return () => clearInterval(interval);
	}, []);

	const renderArrow = () => {
		const indent = ' '.repeat(indentLevel * 1);
		return (
			<Text>
				{indent}
				{arrow}
			</Text>
		);
	};

	return <Text>{renderArrow()}</Text>;
};

export default SendArrowAnimation;
