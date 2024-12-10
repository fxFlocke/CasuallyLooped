import { IsPointInElement } from "@/functionality/geometry";
import { NodeElement, EdgeElement, Position, TextElement, Signal } from "@/datatypes/commondatatypes";
import { useContext } from "react";
import { AppContext } from "@/state/global";

export function getElementByPoint(point: Position, nodes: NodeElement[]): [string, number, number] {
    if(!isPointInCanvas(point)){
      return ["notInCanvas", 0, 0]
    }
    let nodeID = getNodeIdByPoint(point, nodes)
    if (nodeID !== -1){
      return ["node", nodeID, -1]
    }
    let [edgeNodeID, edgeID] = getEdgeIdByPoint(point, nodes)
    if (edgeNodeID !== -1){
      return ["edge", edgeNodeID, edgeID]
    }
    return ["nil", 0, 0]
}

export function getNoteByPoint(point: Position, texts: TextElement[]): number {

  if(!isPointInCanvas(point)){
    return -1
  }

  for(let i = 0; i < texts.length; i++){
    if(IsPointInElement(point, texts[i].pos, 75)){
      return i
    }
  }

  return -1
}

export function getNodeByPoint(point: Position, nodes: NodeElement[]): number {
    for(let i = 0; i < nodes.length; i++){
      if(IsPointInElement(point, nodes[i].node.pos, 75)){
        return i
      }
    }
    return -1
}

export  function getNodeIdByPoint(point: Position, nodes: NodeElement[]): number {
    for(let i = 0; i < nodes.length; i++){
      if(IsPointInElement(point, nodes[i].node.pos, 75)){
        return nodes[i].node.id
      }
    }
    return -1
}

export function getEdgeByPoint(point: Position, nodes: NodeElement[]): [number, number] {
  for(let i = 0; i < nodes.length; i++){
    for(let j = 0; j < nodes[i].edges.length; j++){
      let edge = nodes[i].edges[j]
      if(IsPointInElement(point, { x: edge.geometry.labelDrawBase.labelXY.x, y: edge.geometry.labelDrawBase.labelXY.y}, 75)){
        return [i, j]
      }
    }
  }
  return [-1, 0]
}

export  function getEdgeIdByPoint(point: Position, nodes: NodeElement[]): [number, number] {
    for(let i = 0; i < nodes.length; i++){
      for(let j = 0; j < nodes[i].edges.length; j++){
        let edge = nodes[i].edges[j]
        if(IsPointInElement(point, { x: edge.geometry.labelDrawBase.labelXY.x, y: edge.geometry.labelDrawBase.labelXY.y}, 75)){
          return [nodes[i].node.id, edge.edge.id]
        }
      }
    }
    return [-1, 0]
}

export function getNodeIndexByID(id: number, nodes: NodeElement[]){
    for(let i = 0; i < nodes.length; i++){
      if(nodes[i].node.id === id){
        return i
      }
    }
    return -1
}

export function getEdgeIndexByID(id: number, edges: EdgeElement[]){
  for(let i = 0; i < edges.length; i++){
    if(edges[i].edge.id === id){
      return i
    }
  }
  return -1
}

export function getNodeByID(id: number, nodes: NodeElement[]){
  for(let i = 0; i < nodes.length; i++){
    if(nodes[i].node.id === id){
      return nodes[i]
    }
  }
}

export function getEdgeByID(id: number, edges: EdgeElement[]){
  for(let i = 0; i < edges.length; i++){
    if(edges[i].edge.id === id){
      return edges[i]
    }
  }
}

export function isPointInCanvas(point: Position): boolean {
    if(point.y < 0){
      return false
    }
    return true
}

export function GetSignalCountOnEdge(signals: Signal[], edgeID: number): number {
  let signalCount = 0
  for(let i = 0; i < signals.length; i++){
    if(signals[i].identifiers.edgeID === edgeID){
      signalCount += 1
    }
  }
  return signalCount
}