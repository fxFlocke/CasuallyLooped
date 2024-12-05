import {
    NodeConfiguration,
    EdgeConfiguration,
    NodeElement,
    Node,
    EdgeElement,
    Edge
} from "@/datatypes/commondatatypes";
import { Point } from "@/hooks/usedraw";
import { CalculateEdgeRotationAndArc, EdgeCreationCalculation } from "./geometry";

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
        edgeReferences: [],
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
      allowance: 0
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
          allowance: 0,
      } as EdgeConfiguration;
}