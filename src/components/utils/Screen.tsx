import * as THREE from 'three'
import { ReactElement, Suspense, useMemo, useState } from 'react'
import { Center, Plane, useAspect, useVideoTexture } from '@react-three/drei'
import { DoubleSide, RectAreaLight } from "three";
import video from '../../assets/space_x_video.mp4';


export function Screen() {
    const url = video
    const size = useAspect(1920, 800, 0.2)
  
    return (
      <>
       <Plane scale={size} castShadow receiveShadow>
        <Suspense fallback={<meshStandardMaterial wireframe={true} />}>
          <VideoMaterial  src={url} />
        </Suspense>
      </Plane>
      </>
    )
}

interface VideoMaterialProps {
  src: string;
}

const VideoMaterial = ({ src }: VideoMaterialProps) => {
  const texture = useVideoTexture(src);
  return (
    <meshStandardMaterial 
     emissive={new THREE.Color(0xFFFFFF)}
     emissiveMap={texture}
     emissiveIntensity={0.5}
     side={THREE.FrontSide} 
     map={texture} toneMapped={false} />
  );
}