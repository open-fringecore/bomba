import express from 'express';
import {useEffect, useMemo} from 'react';

export const useCommands = () => {
	const commands = useMemo(() => process.argv?.slice(2), []);

	useEffect(() => {
		return () => {};
	}, []);
};
