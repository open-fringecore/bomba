import React, {useState, useEffect} from 'react';
import {render, Text} from 'ink';

export const Spinner = () => {
	// const frames = "['-', '\\', '|', '/']";
	const frames = ['⢎⡰', '⢎⡡', '⢎⡑', '⢎⠱', '⠎⡱', '⢊⡱', '⢌⡱', '⢆⡱'];
	// const frames = ['▁', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃'];
	// const frames = ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'];
	// const frames = ['◰', '◳', '◲', '◱'];
	// const frames = ['▉', '▊', '▋', '▌', '▍', '▎', '▏', '▎', '▍', '▌', '▋', '▊', '▉'];
	// const frames = ['◡◡', '⊙⊙', '◠◠'];

	const [index, setIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setIndex(currentIndex => (currentIndex + 1) % frames.length);
		}, 100);

		return () => clearInterval(timer);
	}, []);

	return <Text color="green">{frames[index]}</Text>;
};
