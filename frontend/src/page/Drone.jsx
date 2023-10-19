import * as THREE from 'three'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const material = new THREE.MeshPhongMaterial()

export function Drone(props) {
  const group = useRef()
  const { scene, animations } = useGLTF('/drone-draco.glb')
  const { actions } = useAnimations(animations, group)
  useLayoutEffect(() => void scene.traverse((obj) => obj.isMesh && (obj.material = material)), [])
  useEffect(() => void actions.CINEMA_4D_Basis.play(), [])
  useFrame((state, delta) => (group.current.rotation.y += delta / 2))
  return (
    <group ref={group} {...props}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/drone.glb')