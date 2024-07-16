import React, {useState, useEffect} from 'react';
import {render, Text} from 'ink';

const dashSlash = ['-', '\\', '|', '/'];
const dotsRound = ['⢎⡰', '⢎⡡', '⢎⡑', '⢎⠱', '⠎⡱', '⢊⡱', '⢌⡱', '⢆⡱'];
const dots = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const dotsMore = ['⣷', '⣯', '⣟', '⡿', '⢿', '⣻', '⣽', '⣾'];
const dotsMoreReverse = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
const upDownBar = ['▁', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃'];
const upDownDot = ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'];
const boxInBox = ['◰', '◳', '◲', '◱'];
const leftRightBar = [
	'▉',
	'▊',
	'▋',
	'▌',
	'▍',
	'▎',
	'▏',
	'▎',
	'▍',
	'▌',
	'▋',
	'▊',
	'▉',
];
const eye = ['◡◡', '⊙⊙', '◠◠'];
export const spinners = {
	dashSlash,
	dotsRound,
	dots,
	dotsMore,
	dotsMoreReverse,
	upDownBar,
	upDownDot,
	boxInBox,
	leftRightBar,
	eye,
};

type PropType = {
	frames: string[];
	color?: string;
};
export const Spinner = ({frames, color = 'yellow'}: PropType) => {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setIndex(currentIndex => (currentIndex + 1) % frames.length);
		}, 50);

		return () => clearInterval(timer);
	}, []);

	return <Text color={color}>{frames[index]}</Text>;
};
