import { IsPointInElement } from "@/functionality/geometry";
import { NodeElement, Position } from "@/datatypes/commondatatypes";
import { useContext } from "react";
import { AppContext } from "@/state/global";

export function getElementByPoint(point: Position, nodes: NodeElement[]): [string, number] {
    let nodeID = getNodeIdByPoint(point, nodes)
    if (nodeID !== -1){
      return ["node", nodeID]
    }
    let edgeID = getEdgeIdByPoint(point, nodes)
    if (edgeID !== -1){
      return ["edge", edgeID]
    }
    return ["nil", 0]
}

export function getNodeByPoint(point: Position, nodes: NodeElement[]): number {
    for(let i = 0; i < nodes.length; i++){
      if(IsPointInElement(point, nodes[i].node.pos, 50)){
        return i
      }
    }
    return -1
}

export  function getNodeIdByPoint(point: Position, nodes: NodeElement[]): number {
    for(let i = 0; i < nodes.length; i++){
      if(IsPointInElement(point, nodes[i].node.pos, 50)){
        return nodes[i].node.id
      }
    }
    return -1
}

export  function getEdgeIdByPoint(point: Position, nodes: NodeElement[]): number {
    for(let i = 0; i < nodes.length; i++){
      for(let j = 0; j < nodes[i].edges.length; j++){
        let edgeGeometry = nodes[i].edges[j].geometry
        if(IsPointInElement(point, { x: edgeGeometry.labelDrawBase.labelXY.x, y: edgeGeometry.labelDrawBase.labelXY.y}, 50)){
          return nodes[i].node.id
        }
      }
    }
    return -1
}

export  function getNodeIndexByID(id: number, nodes: NodeElement[]){
    for(let i = 0; i < nodes.length; i++){
      if(nodes[i].node.id === id){
        return i
      }
    }
    return -1
}

export  function isPointInCanvas(point: Position): boolean {
    if(point.y < 0){
      return false
    }
    return true
}