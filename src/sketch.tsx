import { Environment, OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { CylinderCollider, Physics, RigidBody, useBeforePhysicsStep } from '@react-three/rapier'
import { useControls as useLeva } from 'leva'
import { useRef } from 'react'
import styled from 'styled-components'
import { CircleGeometry, Quaternion, Vector3 } from 'three'
import { Canvas, Instructions, useLoadingAssets, usePageVisible } from './common'
import { LampPost } from './components/lamp-post'
import { VehicleRef } from './components/vehicle'
import { AFTER_RAPIER_UPDATE, LEVA_KEY, RAPIER_UPDATE_PRIORITY } from './constants/speed-text-tunnel'
import { useControls } from './hooks/use-controls'
import { SpeedTextTunnel } from './constants/speed-text-tunnel'
import { Cybertruck } from './components/cybertruck'
import { Perf } from 'r3f-perf'
import WaterSurfaceSimple from './components/utils/WaterSurface/WaterSurfaceSimple'
import { Island } from './components/island'
import { EffectComposer,DepthOfField } from '@react-three/postprocessing';
import Links from './common/components/interface/links'

const Text = styled.div`
    text-align: center;
    font-size: 2em;
    color: white;
    font-family: monospace;
    text-shadow: 2px 2px black;
`

const SpeedText = styled(Text)`
    position: absolute;
    bottom: 3em;
    left: 2em;
`

const cameraIdealOffset = new Vector3()
const cameraIdealLookAt = new Vector3()
const chassisTranslation = new Vector3()
const chassisRotation = new Quaternion()


const Game = 
() => { 
    const raycastVehicle = useRef<VehicleRef>(null)
    const currentSpeedTextDiv = useRef<HTMLDivElement>(null)

    const camera = useThree((state) => state.camera)
    const currentCameraPosition = useRef(new Vector3(15, 15, 0))
    const currentCameraLookAt = useRef(new Vector3())

    const controls = useControls()

    const { cameraMode } = useLeva(`${LEVA_KEY}-camera`, {
        cameraMode: {
            value: 'drive',
            options: ['drive', 'orbit'],
        },
    })

    const { maxForce, maxSteer, maxBrake } = useLeva(`${LEVA_KEY}-controls`, {
        maxForce: 30,
        maxSteer: 10,
        maxBrake: 2,
    })

    useBeforePhysicsStep((world) => {
        if (!raycastVehicle.current || !raycastVehicle.current.rapierRaycastVehicle.current) {
            return
        }

        const {
            wheels,
            rapierRaycastVehicle: { current: vehicle },
            setBraking,
        } = raycastVehicle.current

        // update wheels from controls
        let engineForce = 0
        let steering = 0

        if (controls.current.forward) {
            engineForce += maxForce
        }
        if (controls.current.backward) {
            engineForce -= maxForce
        }

        if (controls.current.left) {
            steering += maxSteer
        }
        if (controls.current.right) {
            steering -= maxSteer
        }

        const brakeForce = controls.current.brake ? maxBrake : 0

        for (let i = 0; i < vehicle.wheels.length; i++) {
            vehicle.setBrakeValue(brakeForce, i)
        }

        // steer front wheels
        vehicle.setSteeringValue(steering, 0)
        vehicle.setSteeringValue(steering, 1)

        // apply engine force to back wheels
        vehicle.applyEngineForce(engineForce, 2)
        vehicle.applyEngineForce(engineForce, 3)

        // update the vehicle
        vehicle.update(world.timestep)

        // update the wheels
        for (let i = 0; i < vehicle.wheels.length; i++) {
            const wheelObject = wheels[i].object.current
            if (!wheelObject) continue

            const wheelState = vehicle.wheels[i].state
            wheelObject.position.copy(wheelState.worldTransform.position)
            wheelObject.quaternion.copy(wheelState.worldTransform.quaternion)
        }

        // update speed text
        if (currentSpeedTextDiv.current) {
            const km = Math.abs(vehicle.state.currentVehicleSpeedKmHour).toFixed()
             currentSpeedTextDiv.current.innerText = `${km} km/h`
        }

        // update brake lights
        setBraking(brakeForce > 0)
    })

    useFrame((_, delta) => {
        if (cameraMode !== 'drive') {
                return
        } 

        const chassis = raycastVehicle.current?.chassisRigidBody
        if (!chassis?.current) return

        chassisRotation.copy(chassis.current.rotation() as Quaternion)
        chassisTranslation.copy(chassis.current.translation() as Vector3)

        const t = 1.0 - Math.pow(0.01, delta)

        cameraIdealOffset.set(-10, 3, 0)
        cameraIdealOffset.applyQuaternion(chassisRotation)
        cameraIdealOffset.add(chassisTranslation)

        if (cameraIdealOffset.y < 0) {
            cameraIdealOffset.y = 0.5
        }

        cameraIdealLookAt.set(0, 1, 0)
        cameraIdealLookAt.applyQuaternion(chassisRotation)
        cameraIdealLookAt.add(chassisTranslation)

        currentCameraPosition.current.lerp(cameraIdealOffset, t)
        currentCameraLookAt.current.lerp(cameraIdealLookAt, t)

        camera.position.copy(currentCameraPosition.current)
        camera.lookAt(currentCameraLookAt.current)
    }, AFTER_RAPIER_UPDATE)

    return (
        <>
           <SpeedTextTunnel.In>
              <SpeedText ref={currentSpeedTextDiv} />
            </SpeedTextTunnel.In>
            {/* raycast vehicle */}
            {/* <Vehicle  position={[0, 5, 0]} rotation={[0, -Math.PI / 2, 0]} /> */}

            <Cybertruck
            ref={raycastVehicle} 
            position={[-45, 3, 172]} 
            rotation={[0, (- Math.PI / 2) - Math.PI / 2, 0]} 
            />


            <LampPost position={[-115, 3, 340]} rotation={[0, Math.PI / 2, 0]} />

            {/* ramp */}
            <RigidBody type="fixed">
                <mesh rotation-x={-0.3} position={[0, -1, 30]}>
                    <boxGeometry args={[10, 1, 10]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

            {/* bumps */}
            <group position={[0, 0, 50]}>
                {Array.from({ length: 6 }).map((_, idx) => (
                    <RigidBody
                        key={idx}
                        colliders={false}
                        type="fixed"
                        mass={10}
                        rotation={[0, 0, Math.PI / 2]}
                        position={[idx % 2 === 0 ? -0.8 : 0.8, -0.42, idx * 1.5]}
                    >
                        <CylinderCollider args={[1, 0.5]} />
                        <mesh>
                            <cylinderGeometry args={[0.5, 0.5, 2]} />
                            <meshStandardMaterial color="orange" />
                        </mesh>
                    </RigidBody>
                ))}
            </group>

            {/* Rocks */}
            {/* <RigidBody colliders="hull" type="fixed">
                <Rocks receiveShadow castShadow position={[20, 0, 40]} />
            </RigidBody>
            <RigidBody colliders="hull" type="fixed">
                <Rocks receiveShadow castShadow position={[50, 0, 40]} />
            </RigidBody>
            <RigidBody colliders="hull" type="fixed">
                <Rocks receiveShadow castShadow position={[90, 0, 40]} />
            </RigidBody>
            <RigidBody colliders="hull" type="fixed">
                <Rocks receiveShadow castShadow position={[100, 0, 40]} />
            </RigidBody> */}


            {/* boxes */}
            {Array.from({ length: 6 }).map((_, idx) => (
                <RigidBody key={idx} colliders="cuboid" mass={0.2}>
                    <mesh position={[-100, 2 + idx * 2.5, 342]}>
                        <boxGeometry args={[2, 1, 2]} />
                        <meshStandardMaterial color="orange" />
                    </mesh>
                </RigidBody>
            ))}

            {/* screens */}
            {/* <group rotation={[0 ,-Math.PI + Math.PI / 4, 0]} position={[20, 4.5, 20]}>
                <Screen />
            </group> */}
            

            {/* ground */}
                {/* <RigidBody type="fixed" position-z={75} position-y={-5} colliders={false} friction={1}>
                    <CuboidCollider args={[120, 5, 120]} />
                    <mesh receiveShadow>
                        <boxGeometry args={[240, 10, 240]} />
                        <meshStandardMaterial color="#303030" />
                    </mesh>
                </RigidBody> */}
                {/*}
                    <RigidBody type="fixed" position-y={-0.25} colliders={false} friction={1}>
                        <CylinderCollider args={[0.25, 200]} /> 
                        <Cylinder args={[200, 200, 0.5, 20]} receiveShadow castShadow>
                             <meshStandardMaterial color="#303030" />
                        </Cylinder>
                    </RigidBody>
                 */}
                
            {/* Island */}
            <RigidBody type="fixed" colliders={'trimesh'}>
                <Island visible={true}/>
            </RigidBody>


            {/* ROAD*/}
                {/* <mesh position={[0, 0.02, 50]} rotation-x={-Math.PI / 2} receiveShadow>
                    <planeGeometry args={[15, 150]} />
                    <meshStandardMaterial color="#222" depthWrite={false} />
                </mesh> */}


            {/* WATER*/}
            {/* <WaterSurfaceSimple geom={new CircleGeometry(10, 32)} width={20} length={20} position={[20, 0.1, 35]}>
            </WaterSurfaceSimple> */}
            <WaterSurfaceSimple 
            waterColor={0x8174A0}
            geom={new CircleGeometry(4000, 32)}
             width={20} length={20}
              position={[0, 0.2, 0]}>
            </WaterSurfaceSimple>



            {/** LUMIERRE ET CIEL*/}
            {/* <hemisphereLight intensity={0.75} />
            <ambientLight intensity={0.5} /> */}
            <Environment files='sunset-4k.hdr'
            background={true} backgroundIntensity={0.2} 
            environmentIntensity={0.2} 
            />
            {/* <Sky
                distance={450000} // Distance de rendu
                inclination={0.495} // Inclinaison pour simuler un soleil bas
                rayleigh={2} // Effet de diffusion atmosphérique
                mieDirectionalG={0.6} // Donne un effet plus large au soleil
                azimuth={-0.2}
            /> */}
            {/* <pointLight position={[10, 10, 100]} intensity={100} decay={0.15} 
            distance={100} 
            castShadow color="#ED9121"/> */}

            <directionalLight  color="#e8b6bb" intensity={5} 
            position={[10,10,20]}/>

            {/* <Stars /> */}

            {cameraMode === 'orbit' && <OrbitControls/>}
        </>
    )
}

export function Sketch() {
    const loading = useLoadingAssets()
    const visible = usePageVisible()

    const { debug } = useLeva(`${LEVA_KEY}-physics`, {
        debug: false,
    })

    return (
        <> 
            <Canvas 
            camera={{ fov: 60, position: [0, 30, -20], far: 4000 }}
            shadows
            gl={{ antialias: true }}
            >
                <EffectComposer>

                <DepthOfField focusDistance={0} focalLength={0.5} bokehScale={2} height={480} />
                    
                    {debug ? <Perf position="top-left" /> : <></>}

                    <color attach="background" args={['#111']} />
                    <Physics
                        gravity={[0, -9.81, 0]}
                        updatePriority={RAPIER_UPDATE_PRIORITY}
                        // todo: support fixed timestepping
                        // right now if timeStep is not "vary", the wheel positions will be incorrect and will visually jitter
                        // timeStep={
                        //     1/120 // "vary" //   1/60 // "vary"
                        // }
                        paused={!visible || loading}
                        debug={debug}
                    >
                        <Game 
                        />
                    </Physics>
                
                </EffectComposer>
            </Canvas>
            <SpeedTextTunnel.Out />
            <Instructions>Enjoy the ride !</Instructions>
            <Links></Links>
        </>
    )
}
