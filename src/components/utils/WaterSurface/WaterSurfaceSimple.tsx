import { useMemo, useRef } from 'react';
import { BufferGeometry, PlaneGeometry, RepeatWrapping, Vector2 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { WaterSimple } from './Water/WaterSimple';
import { WaterContext } from './WaterContext';
import simplewaternormals from '/water/simple/waternormals.jpeg?url';


type Props = {
	width?: number;
	length?: number;
	dimensions?: number;
	waterColor?: number;
	position?: [number, number, number];
	distortionScale?: number;
	fxDistortionFactor?: number;
	fxDisplayColorAlpha?: number;
	fxMixColor?: number | string;
	geom?: BufferGeometry; // Define geometry type
	children?: React.ReactNode;
};

export default function WaterSurfaceSimple({
	width = 190,
	length = 190,
	dimensions = 1024,
	waterColor = 0x000000,
	position = [0, 0, 0],
	distortionScale = 3,
	fxDistortionFactor = 0.2,
	fxDisplayColorAlpha = 0.0,
	fxMixColor = 0x000000,
	geom = useMemo(
		() => new PlaneGeometry(width, length),
		[length, width]
	),
	children,
}: Props) {
	const ref = useRef<any>();
	const refPointer = useRef(new Vector2(0, 0));

	const gl = useThree((state) => state.gl);
	const waterNormals = useTexture(simplewaternormals);
	waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;
	const config = useMemo(
		() => ({
			textureWidth: dimensions,
			textureHeight: dimensions,
			waterNormals,

			waterColor: waterColor,
			distortionScale: distortionScale,
			fxDistortionFactor: fxDistortionFactor,
			fxDisplayColorAlpha: fxDisplayColorAlpha,
			fxMixColor: fxMixColor,
			fog: false,
			format: (gl as any).encoding,
		}),
		[
			dimensions,
			distortionScale,
			fxDisplayColorAlpha,
			fxDistortionFactor,
			fxMixColor,
			gl,
			waterColor,
			waterNormals,
		]
	);
	// @ts-ignore: don't remove state is essential here in the lib
	useFrame((state, delta) => {
		if (ref.current) ref.current.material.uniforms.time.value += delta / 2;
	});

	//const refPointer = useRef(new Vector2(0, 0));

	const waterObj = useMemo(
		() => new WaterSimple(geom, config),
		[geom, config]
	);

	const handlePointerMove = (e: any) => {
		refPointer.current = e.uv.multiplyScalar(2).subScalar(1);
		//console.log(e.uv);
	};

	return (
		<WaterContext.Provider value={{ ref: ref, refPointer: refPointer }}>
			<primitive
				ref={ref}
				onPointerMove={handlePointerMove}
				object={waterObj}
				rotation-x={-Math.PI / 2}
				position={position}
			/>

			{children}
		</WaterContext.Provider>
	);
}
