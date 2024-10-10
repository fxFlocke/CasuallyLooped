import { useContext, useRef } from 'react'
import { useControls } from 'leva'
import * as t from 'three'
import { useFrame } from '@react-three/fiber'
import NodeCore from './NodeCore'
import { AppContext } from "@/state/global";
import NodeHighlight from './NodeHighlight'
import { ColorCollection, SizeCollection } from '@/datatypes/collections'

export default function Edge3D(props: any) {
  const ref = useRef<any>()
  const [appState, dispatch] = useContext(AppContext);

  const fromVector = new t.Vector3(props.from.x, props.from.y, 0)
  const toVector = new t.Vector3(props.to.x, props.to.y, 0)
  const direction = toVector.clone().sub(fromVector)
  const length = direction.length()

  // useFrame((_, delta) => {
  //   ref.current.rotation.x += 0.2 * delta
  //   ref.current.rotation.y += 0.05 * delta
  // })

  return (
    <mesh {...props} ref={ref}>
      <arrowHelper args={[direction, fromVector, length, 'white', 1, 1]}/>
      <meshBasicMaterial />
    </mesh>
  )
}