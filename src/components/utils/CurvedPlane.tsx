import * as THREE from 'three'
import { ReactElement, Suspense, useMemo, useState } from 'react'
import { Center, useVideoTexture } from '@react-three/drei'

// List of films from https://gist.github.com/jsturgis/3b19447b304616f18657
const films = {
  Sintel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'Big Buck Bunny': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'Elephant Dream': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'For Bigger Blazes': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'For Bigger Joy Rides': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
}

const { DEG2RAD } = THREE.MathUtils


export function SceneWithScreen() {
  
    const url = {
        value: films['Sintel'],
        options: films
      }
    ;
  
    return (
      <>
  
        <group position={[5,0,5]} rotation-y={DEG2RAD * 40}>
          <Screen src={url} />
        </group>
      </>
    )
  }

function Screen(src: any) {
    const [video, setVideo] = useState()
  
    const ratio = 16 / 9
    const width = 5
    const radius = 4
    const z = 4
  
    const r = useMemo(() => (video ? video.videoWidth / video.videoHeight : ratio), [video, ratio])
  
    return (
      <Center top position-z={z}>
        <CurvedPlane width={width} height={width / r} radius={radius}>
          <Suspense fallback={<meshStandardMaterial side={THREE.DoubleSide} wireframe />}>
            <VideoMaterial src={src} setVideo={setVideo} />
          </Suspense>
        </CurvedPlane>
      </Center>
    )
  }
  
  function VideoMaterial( src: any, setVideo: any) {
    const texture = useVideoTexture(src)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.x = -1
    texture.offset.x = 1
  
    setVideo?.(texture.image)
  
    return <meshStandardMaterial side={THREE.DoubleSide} map={texture} toneMapped={false} transparent opacity={0.9} />
  }

  const CurvedPlane: React.FC<{
    width: any
    height: any
    radius: any
    children: ReactElement
    [x: string]: any
  }> = ({ width, height, radius, children, ...props }) => {
    const { geometry, heightMin, heightMax } = useMemo(
      () => curvedPlaneGeometry(width, height, radius),
      [width, height, radius
  ]
    )
  
    return (
      <group {...props}>
        <mesh geometry={geometry} receiveShadow castShadow position-z={-heightMax}>
          {children}
        </mesh>
      </group>
    )
  }

function curvedPlaneGeometry(width = 1, height = 1, radius = 2) {
  const segments = 32
  const segmentsH = segments
  const segmentsV = segments / (width / height) // square
  const geometry = new THREE.PlaneGeometry(width, height, segmentsH, segmentsV)

  let heightMin = Infinity
  let heightMax = -Infinity

  const distanceMax = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2)
  radius = Math.max(distanceMax, radius)

  const position = geometry.attributes.position
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i)
    const y = position.getY(i)

    const distance = Math.sqrt(x * x + y * y)
    const height = Math.sqrt(Math.max(radius ** 2 - distance ** 2, 0))
    heightMin = Math.min(height, heightMin)
    heightMax = Math.max(height, heightMax)
    position.setZ(i, height)
  }

  // geometry.computeVertexNormals()
  // position.needsUpdate = true

  return { geometry, heightMin, heightMax }
}
