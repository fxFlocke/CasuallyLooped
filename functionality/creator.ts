import {
    NodeConfiguration,
    EdgeConfiguration,
    NodeElement,
    Node,
    EdgeElement,
    Edge,
    ThreeBase,
    CameraProps
} from "@/datatypes/commondatatypes";
import { Point } from "@/hooks/usedraw";
import { CalculateEdgeRotationAndArc, EdgeCreationCalculation } from "./geometry";
import * as t from 'three'

export function CreateNodeElement(point: Point, uid: number){
    let node: Node = {
        id: uid,
        pos: {
          x: point.x,
          y: point.y,
        },
        label: "",
        value: 0.5,
        edges: [],
    };
    let nodeElement: NodeElement = {
        node: node,
        config: createDefaultNodeConfiguration(),
        geometry: {
          circleRadius: 0,
          controlsAlpha: 0,
          controlsDirection: 0
        },
        edges: [],
    };
    return nodeElement
}

export function CreateEdgeElement(points: Point[], startNode: Node, endNode: Node, uid: number){
    let [rotation, arc] = CalculateEdgeRotationAndArc(points, startNode, endNode)
    let [drawBase, labelBase, arrowBase] = EdgeCreationCalculation(startNode, endNode, arc, rotation)
    let edge: Edge = {
      id: uid,
      from: startNode.id,
      to: endNode.id,
      impact: 1,
    }
    let edgeElement: EdgeElement = {
      edge: edge,
      config: createDefaultEdgeConfiguration(),
      geometry: {
        arc: arc,
        from: startNode.id,
        to: endNode.id,
        rotation: rotation,
        drawBase: drawBase,
        labelDrawBase: labelBase,
        arrowDrawBase: arrowBase
      }
    }
    return edgeElement
}

export function CreateThreeBase(canvas: HTMLCanvasElement | null){
  if(canvas === null) return defaultThreeBase()

  let camProps = createCamProps(canvas)
  let context = canvas.getContext("webgl")
  console.log("no context")
  if(!context) return defaultThreeBase()

  console.log("created real three base")
  let threeBase: ThreeBase = {
    scene: new t.Scene(),
    camera: new t.PerspectiveCamera( camProps.fov, camProps.aspect, camProps.near, camProps.far),
    renderer: new t.WebGLRenderer( { context: context } )
  }

  return threeBase
}

function defaultThreeBase(){
  let threeBase: ThreeBase = {
    scene: new t.Scene(),
    camera: new t.PerspectiveCamera( 75, 0, 0.1, 100),
    renderer: new t.WebGLRenderer()
  }
  return threeBase
}

function createCamProps(canvas: HTMLCanvasElement){
  console.log(canvas.width)
  console.log(canvas.height)
  let camProps: CameraProps = {
    fov: 75,
    aspect: (canvas.width / canvas.height),
    near: 0.1,
    far: 100
  }
  return camProps
}

function createDefaultNodeConfiguration(){
    return {
          id: 0,
          startValue: 0.83,
          label: "",
          hue: 4,
          radius: 50,
      } as NodeConfiguration;
}

function createDefaultEdgeConfiguration(){
    return {
          id: 0,
          label: "",
          strength: 1,
          lowBound: 0,
          highBound: 1,
      } as EdgeConfiguration;
}