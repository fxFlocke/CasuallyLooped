import { useContext, useRef } from 'react'
import { useControls } from 'leva'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import NodeCore from './NodeCore'
import { AppContext } from "@/state/global";
import NodeHighlight from './NodeHighlight'
import { ColorCollection, SizeCollection } from '@/datatypes/collections'

export default function Node3D(props: any) {
  const ref = useRef<any>()
  const [appState, dispatch] = useContext(AppContext);

  function decideColor(color: number){
    return ColorCollection[color]
  }

  function decideSizeValue(size: number){
    return SizeCollection[size]
  }

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
      <meshBasicMaterial wireframe wireframeLinewidth={0.2} />
      <NodeCore name="nodeCore" position={[0, 0, 0]} color={decideColor(props.color)} size={decideSizeValue(props.size)}/>
      {
        appState.config.editingIndex === props.nodeid && <NodeHighlight name="nodeHighlight" position={[0, 0, 0]}/>
      }
    </mesh>
  )
}