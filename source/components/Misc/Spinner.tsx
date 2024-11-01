import React, {useState, useEffect} from 'react';
import {render, Text} from 'ink';

// ! Lots of spinners in this url
// ! https://raw.githubusercontent.com/sindresorhus/cli-spinners/master/spinners.json
// ! https://codepen.io/moritzjacobs/pen/WXBPxO

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
const fish = ['𓆝 ', '𓆟', '𓆞', '𓆝', '𓆟'];
const eye = ['◡◡', '⊙⊙', '◠◠'];
const hash = ['✶', '✸', '✹', '✺', '✹', '✷'];
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
	fish,
	hash,
};

type TProps = {
	frames: string[];
	color?: string;
	speed?: number;
};
export const Spinner = ({frames, color = 'yellow', speed = 50}: TProps) => {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setIndex(currentIndex => (currentIndex + 1) % frames.length);
		}, speed);

		return () => clearInterval(timer);
	}, [frames]);

	return <Text color={color}>{frames[index]}</Text>;
};
