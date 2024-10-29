import React, {useState, useEffect} from 'react';
import {Text, render} from 'ink';

type PropType = {
	speed?: number;
};
const WaveAnimation = ({speed = 250}: PropType) => {
	const [waveStage, setWaveStage] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setWaveStage(prevStage => (prevStage + 1) % 3);
		}, speed);

		return () => clearInterval(interval);
	}, []);

	const renderWave = () => {
		switch (waveStage) {
			case 0:
				return (
					<Text color={'magenta'} bold>
						⠀⠀⠀‧⠀⠀⠀
					</Text>
				);
			case 1:
				return (
					<Text>
						⠀
						<Text color={'redBright'} bold>
							﹙
						</Text>
						<Text color={'magentaBright'} bold>
							‧
						</Text>
						<Text color={'redBright'} bold>
							﹚
						</Text>
						⠀
					</Text>
				);
			case 2:
				return (
					<Text>
						<Text color={'red'} bold>
							(
						</Text>
						<Text color={'redBright'} bold>
							﹙
						</Text>
						<Text color={'magenta'} bold>
							‧
						</Text>
						<Text color={'redBright'} bold>
							﹚
						</Text>
						<Text color={'red'} bold>
							)
						</Text>
					</Text>
				);
			default:
				return null;
		}
	};

	return <Text>{renderWave()}</Text>;
};
export default WaveAnimation;
