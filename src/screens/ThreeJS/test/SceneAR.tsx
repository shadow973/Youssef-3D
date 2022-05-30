import React from 'react';
import {
	ViroARScene,
	Viro3DObject,
	ViroAmbientLight
} from 'react-viro';

const MarmelabLogo = () => (
	<Viro3DObject
		source={require('../../../assets/models/piece.glb')}
		position={[0, 0, -1]} // we place the object in front of us (z = -1)
		scale={[0.5, 0.5, 0.5]} // we reduce the size of our Marmelab logo object
		type='GLB'
	/>
);

export const SceneAR = () => (
	<ViroARScene displayPointCloud>
		<ViroAmbientLight color="#fff" />
		<MarmelabLogo />
	</ViroARScene>
);

export default SceneAR