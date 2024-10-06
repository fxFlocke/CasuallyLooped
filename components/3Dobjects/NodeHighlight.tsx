import { useRef } from 'react'
import { useControls } from 'leva'
import * as THREE from 'three'
import { useFrame, useLoader } from '@react-three/fiber'

export default function NodeHighlight(props: any) {
  const ref = useRef<any>()
  const textureMap = useLoader(THREE.TextureLoader, "/icons/3D/fog2.png")

  useFrame((_, delta) => {
    ref.current.rotation.x += 0.9 * delta
    ref.current.rotation.y += 0 * delta
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
      <sphereGeometry args={[ 0.6, 128, 128 ]} />
      <meshBasicMaterial 
        alphaMap={textureMap} 
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}