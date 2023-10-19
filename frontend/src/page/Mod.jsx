import * as THREE from 'three'
import React, { Suspense, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CameraShake } from '@react-three/drei'
import { useControls } from 'leva'
import { Drone } from './Drone'
import { Lightmap } from './Lightmap'
import backg from "./backg.jpg";

function Rig() {
  const [vec] = useState(() => new THREE.Vector3())
  const { camera, mouse } = useThree()
  useFrame(() => camera.position.lerp(vec.set(Math.sin(mouse.x) * 100, mouse.y * 25, Math.cos(mouse.x) * 100 + 200), 0.05))
  return <CameraShake maxYaw={0.1} maxPitch={0.1} maxRoll={0.1} yawFrequency={0.5} pitchFrequency={0.5} rollFrequency={0.4} />
}

const Mod = () => {
  const props = useControls({
    intensity: { value: 1, min: 0, max: 1, step: 0.1 },
    ambient: { value: 0.5, min: 0, max: 1, step: 0.1 },
    radius: { value: 25, min: 0, max: 100, step: 1 },
    blend: { value: 40, min: 1, max: 200, step: 1 },
  })
  return (
    <body style={{backgroundImage:`url(${backg})`,height:"950px"}}>
        <center className='pt-5' style={{marginTop:'50px'}}>
    <Canvas shadows dpr={[1, 1.5]} gl={{ alpha: false }} camera={{ position: [0, 1000, 0], fov: 50 }}  style={{width:"auto",height:"700px"}}>
      <color attach="backgroundimage" args={[`url(${backg})`]} />
      <fog attach="fog" args={['#d0d0d0', 100, 600]} />
      <Suspense fallback={null}>
        
        <Lightmap position={[50, 150, 50]} {...props}>
          <Drone rotation={[0, 5.25, 0]} position={[0, 40, 0]} />
          <mesh scale={1000} position={[0, -60, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry />
            <meshPhongMaterial color="#c0c0c0" />
          </mesh>
        </Lightmap>
        
      </Suspense>
      <Rig />
    </Canvas>
    </center>
    </body>
  )
}



    


export default Mod