import { useGLTF } from "@react-three/drei"
import { GLTF } from "three/examples/jsm/Addons.js"
import * as THREE from 'three'

    
type GLTFResult = GLTF & {
    nodes: {
      formation_rock_1: THREE.Mesh,formation_rock_2: THREE.Mesh
      
    }
    materials: {
      ['wood.008']: THREE.MeshStandardMaterial,sand: THREE.MeshStandardMaterial
    }
  }

export function Rocks(props: JSX.IntrinsicElements['group']) {
          const { nodes, materials } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/formation-rock/model.gltf') as unknown as GLTFResult
          return (
            <group {...props} dispose={null}>
              <group scale={10} position={[5.7, 0, -10.67,]} >
                <mesh castShadow receiveShadow geometry={nodes.formation_rock_1.geometry} material={materials['wood.008']} />
                <mesh castShadow receiveShadow geometry={nodes.formation_rock_2.geometry} material={materials.sand} />
              </group>

            </group>
          )
        }

useGLTF.preload('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/formation-rock/model.gltf')