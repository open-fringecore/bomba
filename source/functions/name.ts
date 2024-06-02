import {useState, useEffect} from 'react';
import * as os from 'os';
import {useStore} from '@nanostores/react';
import {$baseInfo} from '../stores/baseStore.js';

function getComputerName(): string {
	return os.hostname();
}

const useComputerName = () => {
	useEffect(() => {
		const name = getComputerName();
		$baseInfo.set({...$baseInfo.get(), MY_NAME: name});
	}, []);

	return null;
};

export default useComputerName;
