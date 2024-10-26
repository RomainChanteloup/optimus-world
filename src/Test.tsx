/* eslint-disable */
import { Box, KeyboardControls, KeyboardControlsEntry, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber'
import { Physics, RigidBody } from "@react-three/rapier";
import { Car } from './components/car';
import { useMemo } from 'react';

export enum ControlsMapping {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  stop = 'stop',
}


function Test() {

  const map = useMemo<KeyboardControlsEntry<ControlsMapping>[]>(()=>[
    { name: ControlsMapping.forward, keys: ['ArrowUp'] },
    { name: ControlsMapping.back, keys: ['ArrowDown'] },
    { name: ControlsMapping.left, keys: ['ArrowLeft'] },
    { name: ControlsMapping.right, keys: ['ArrowRight'] },
    { name: ControlsMapping.stop, keys: ['Space'] },
  ], [])

  return (
    <>
    <KeyboardControls map={map}>
    <Canvas camera={{ position: [0, 15, 15], fov: 60 }} shadows>
      <color attach="background" args={["white"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 0]} intensity={1} />
      <Physics debug>
          <Car />
          <RigidBody type="fixed" colliders="cuboid">
          <Box position={[0,-5,0]} args={[100, 1, 100]} />
          </RigidBody>
      </Physics>
      <OrbitControls />
    </Canvas>
    </KeyboardControls>
  </>
  )
}

export default Test;
