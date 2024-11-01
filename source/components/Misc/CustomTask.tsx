import React from 'react';
import {Text} from 'ink';
import {Spinner, spinners} from '@/components/Misc/Spinner.js';

export const icon = {
	pending: <Text color={'gray'}>◼</Text>,
	loading: (frames: string[], color: string) => (
		<Spinner frames={frames} color={color} />
	),
	success: <Text color={'green'}>✔</Text>,
	warning: <Text color={'yellow'}>⚠</Text>,
	error: <Text color={'red'}>✘</Text>,
};

type TProps = {
	label: string;
	state?: 'pending' | 'success' | 'warning' | 'error' | 'loading';
	frames?: string[];
	color?: string;
};

const CustomTask = ({
	label,
	state = 'pending',
	frames = spinners.dots,
	color = 'yellow',
}: TProps) => {
	return (
		<Text>
			<Text>
				{state === 'loading' ? icon.loading(frames, color) : icon[state]}
			</Text>
			<Text> {label}</Text>
		</Text>
	);
};

export default CustomTask;
