/**
 * OLD TEST COMPONENT
 */
import { Box, Cylinder, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  useRevoluteJoint,
  Vector3Array
} from "@react-three/rapier";
import { createRef, RefObject, useRef } from "react";
// import { ControlsMapping } from "../App";

const WheelJoint = ({
  body,
  wheel,
  bodyAnchor,
  wheelAnchor,
  rotationAxis
}: {
  body: RefObject<RapierRigidBody>;
  wheel: RefObject<RapierRigidBody>;
  bodyAnchor: Vector3Array;
  wheelAnchor: Vector3Array;
  rotationAxis: Vector3Array;
}) => {
  const joint = useRevoluteJoint(body, wheel, [
    bodyAnchor,
    wheelAnchor,
    rotationAxis
  ]);
  const [, get] = useKeyboardControls()


  useFrame(() => {
    const { forward, back, left, right, stop } = get()

    if (joint.current) {
      if(forward){
        console.log(forward)
        joint.current.configureMotorVelocity(20, 10);
      }
      if(back){
        joint.current.configureMotorVelocity(-20, 10);
      }
      if(stop){
        joint.current.configureMotorVelocity(0, 0);
      }
    }
  });

  return null;
};

export function Car(): any {
  const bodyRef = useRef<RapierRigidBody>(null);
  const wheelPositions: [number, number, number][] = [
    [-3, 0, 2], // Front left
    [-3, 0, -2], // Front right
    [3, 0, 2], // Rear left
    [3, 0, -2] // Rear right
  ];
  const wheelRefs = useRef(
    wheelPositions.map(() => createRef<RapierRigidBody>())
  );

  return (
    <group>
      <RigidBody colliders="cuboid" ref={bodyRef} type="dynamic">
        <Box scale={[6, 1, 2]} castShadow receiveShadow name="chassis">
          <meshStandardMaterial color={"red"} />
        </Box>
      </RigidBody>
      {wheelPositions.map((wheelPosition, index) => (
        <RigidBody
          position={wheelPosition}
          colliders="hull"
          type="dynamic"
          key={index}
          ref={wheelRefs.current[index]}
        >
          <Cylinder
            rotation={[Math.PI / 2, 0, 0]}
            args={[1, 1, 1, 32]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={"grey"} />
          </Cylinder>
        </RigidBody>
      ))}
      {wheelPositions.map((wheelPosition, index) => (
        <WheelJoint
          key={index}
          body={bodyRef}
          wheel={wheelRefs.current[index]}
          bodyAnchor={wheelPosition}
          wheelAnchor={[0, 0, 0]}
          rotationAxis={[0, 0, 1]}
        />
      ))}
    </group>
  );
};
