import React from 'react';
import {Text} from 'ink';
import {Spinner, spinners} from '@/components/Misc/Spinner.js';

export const icon = {
	pending: <Text color={'gray'}>◼</Text>,
	loading: <Spinner frames={spinners.dots} color={'yellow'} />,
	success: <Text color={'green'}>✔</Text>,
	warning: <Text color={'yellow'}>⚠</Text>,
	error: <Text color={'red'}>✘</Text>,
};

type PropType = {
	label: string;
	state?: 'pending' | 'success' | 'warning' | 'error' | 'loading';
};
const CustomTask = ({label, state = 'pending'}: PropType) => {
	return (
		<Text>
			<Text>{icon[state]}</Text>
			<Text>{label}</Text>
		</Text>
	);
};

export default CustomTask;
