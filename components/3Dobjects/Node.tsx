import { useRef } from 'react'
import { useControls } from 'leva'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import NodeCore from './NodeCore'

export default function Node3D(props: any) {
  const ref = useRef<any>()

  useFrame((_, delta) => {
    ref.current.rotation.x += 0.2 * delta
    ref.current.rotation.y += 0.05 * delta
  })

//   useControls(props.name, {
//     wireframe: {
//       value: false,
//       onChange: (v) => {
//         ref.current.material.wireframe = v
//       },
//     },
//     flatShading: {
//       value: true,
//       onChange: (v) => {
//         ref.current.material.flatShading = v
//         ref.current.material.needsUpdate = true
//       },
//     },
//     color: {
//       value: 'lime',
//       onChange: (v) => {
//         ref.current.material.color = new THREE.Color(v)
//       },
//     },
//   })

  return (
    <mesh {...props} ref={ref}>
      <sphereGeometry args={[ 0.5, 16, 16 ]} />
      <meshBasicMaterial wireframe wireframeLinewidth={0.2} color={""} />
      <NodeCore name="nodeCore" position={[0, 0, 0]}/>
    </mesh>
  )
}