/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext, useRef } from "react";
import { Topbar } from "@/components/bars/topbar";
import {
  NodeElement
} from "@/datatypes/commondatatypes";
import { DrawNode } from "@/functionality/draw/drawNode";
import { DrawEdge } from "@/functionality/draw/drawEdge";
import { Draw, Point, useClickMove } from "@/hooks/usedraw";
import { Node, ThreeBase } from "@/datatypes/commondatatypes";
import { AppContext } from "@/state/global";
import { Decide3DxOffset, DecideYPosition, ScaleCanvasForDevicePixelRatio } from "@/functionality/geometry";
import { CreateEdgeElement, CreateNodeElement, CreateThreeBase } from "@/functionality/creator";
import { getElementByPoint, getNodeByPoint, getNodeIndexByID, isPointInCanvas } from "@/functionality/searcher";
import { DrawInk } from "@/functionality/draw/drawInk";
import * as t from 'three'
import { Canvas } from '@react-three/fiber'
import Polyhedron from "../3Dobjects/Polyhedron";
import Node3D from "../3Dobjects/Node";

var globalNodeID: number = 0;
var globalEdgeID: number = 0;
var activePoints: Point[] = [];
const lineColor = "#FFF"

export function Loopy() {

  const { canvasRef, onMouseDown, mouseClick, clear } = useClickMove(handleClickMove);
  const [dragNode, setDragNode] = useState(-1)
  const [appState, dispatch] = useContext(AppContext);

  const widthBase = (11.6 / 1200)
  const heightBase = (7.8 / 800)
  const widthOffset = widthBase * (1200 / 2)
  const heightOffset = heightBase * (800 / 2)

  useEffect(() => {
    let exit = decideMouseDownExit()
    if(exit){
      return
    }

    switch(appState.config.actionMode){
      case "ink":
        hamdleInkEnd()
        break
      case "erase":
        handleEraseEnd()
        break
      default: 
        break
    }

    clear()
    activePoints = []
  }, [onMouseDown]);

  useEffect(() => {
    switch(appState.config.actionMode){
      case "ink":
        handleInkClick()
        break
      case "drag":
        handleDragClick()
        break
    }
  }, [mouseClick])

  useEffect(() => {
    switch(appState.config.viewMode){
      case "2D":
        DrawGeometries()
        break
      case "3D":
        clear()
    }
    if(appState.config.nodes !== undefined && appState.config.nodes.length > 0){
      console.log(appState.config.nodes[appState.config.nodes.length - 1].node.pos.y)
      console.log(DecideYPosition(appState.config.nodes[appState.config.nodes.length - 1].node.pos, ((heightBase * appState.config.nodes[appState.config.nodes.length - 1].node.pos.y))))
    }
  }, [appState])

  return (
    <>
      <div className="pb-6 z-20">
        <Topbar/>
      </div>
        <div className="ml-8 mr-8 mt-28 mb-8 relative w-[1200px] h-[800px]">
          <div className="w-[1200px] h-[800px] z-10 bg-[#1c1d1d] rounded-2xl border-4 border-stone-300 bg-opacity-90 absolute">
            {appState.config.viewMode === "3D" &&   
              <Canvas> 
                {
              appState.config.nodes.map((nodeElement: NodeElement) => (
                <Node3D key={nodeElement.node.id} name="meshNormalMaterial" position={[((widthBase * nodeElement.node.pos.x ) - 5.8), DecideYPosition(nodeElement.node.pos, ((heightBase * nodeElement.node.pos.y))), 0]} />
              ))}
              </Canvas>
            }
          </div>

          <canvas
            className={`w-[1200px] h-[800px] z-10 bg-opacity-0 absolute
                  ${
                    appState.config.actionMode === "ink" && "cursor-[url('/icons/whitePencil.png'),_pointer]" ||
                    appState.config.actionMode === "text" && "cursor-[url('/icons/whiteText.png'),_pointer]" ||
                    (appState.config.actionMode === "drag" && dragNode === -1) && "cursor-[url('/icons/whiteHand.png'),_pointer]" ||
                    (appState.config.actionMode === "drag" && dragNode !== -1) && "cursor-[url('/icons/whiteHandClenched.png'),_pointer]" ||
                    appState.config.actionMode === "erase" && "cursor-[url('/icons/whiteRubber.png'),_pointer]"
                  }
              "`}
            ref={canvasRef}
            onMouseDown={onMouseDown}
            width={1200}
            height={800}>
          </canvas>
        </div>
    </>
  );

  function createNodeInState(point: Point) {
    let nodeUID = getNodeUID()
    let nodeElement = CreateNodeElement(point, nodeUID)
    appState.config.nodes.push(nodeElement);
    console.log("created node: ", nodeElement.node.id)
    dispatch({type: "CHANGE_EDITING_INDEX", data: nodeElement.node.id})
  }

  function createEdgeInState(points: Point[], startNode: Node, endNode: Node) {
    let edgeUID = getEdgeUID()
    let edgeElement = CreateEdgeElement(points, startNode, endNode, edgeUID)
    let nodes = appState.config.nodes
    let nodeIndex = getNodeIndexByID(startNode.id, appState.config.nodes)
    nodes[nodeIndex].edges.push(edgeElement)
    dispatch({type: "CHANGE_NODE", data: nodes})
    dispatch({type: "CHANGE_EDITING_INDEX", data: edgeElement.edge.id})
  }

  function DrawGeometries(){
    let ctx = canvasRef.current?.getContext("2d")
    if(appState.config.nodes === undefined || appState.config.viewMode === "3D" || ctx === undefined || ctx == null){
      return
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    let editingIndex = appState.config.editingIndex
    let editMode = appState.config.editMode
    clear()
    for (let i = 0; i < appState.config.nodes.length; i++){
      DrawNode(ctx, appState.config.nodes[i], editingIndex, editMode)
    }
    for (let i = 0; i < appState.config.nodes.length; i++){
      for (let j = 0; j < appState.config.nodes[i].edges.length; j++){
        DrawEdge(ctx, appState.config.nodes[i].edges[j], editingIndex, editMode)
      }
    }
  }



  //Mouse-Action-Handlers 


  //MOUSE-CLICK

  //DRAG-CLICK || END OF DRAG-CLICKED-MOUSE-MOVE
  function handleDragClick(){
    //End of DRag
    if(dragNode !== -1){
      clear()
      activePoints = []
      setDragNode(-1)
      DrawGeometries()
      return
    }

    //Node Clicked
    let nodeIndex = getNodeByPoint({x: mouseClick.x, y: mouseClick.y}, appState.config.nodes)
    if(nodeIndex !== -1){
      console.log("got Node")
      dispatch({type: "CHANGE_EDIT_MODE", data: "node"})
      dispatch({type: "CHANGE_EDITING_INDEX", data: appState.config.nodes[nodeIndex].node.id})
      return
    }

    //Canvas clicked
    if (isPointInCanvas(mouseClick)){
      dispatch({type: "CHANGE_EDITING_INDEX", data: -1})
      DrawGeometries()
    }
  }

  //INK-CLICK
  function handleInkClick(){
    if(appState.config.nodes === undefined){
      return
    }
    let [type, id] = getElementByPoint(mouseClick, appState.config.nodes)
    if (id !== 0 && type === "node"){
      dispatch({type: "CHANGE_EDIT_MODE", data: "node"})
      dispatch({type: "CHANGE_EDITING_INDEX", data: id})
      return
    }
    else if (id !== 0 && type === "edge"){
      dispatch({type: "CHANGE_EDIT_MODE", data: "edge"})
      dispatch({type: "CHANGE_EDITING_INDEX", data: id})
      return
    }
    if (isPointInCanvas(mouseClick)){
      console.log("resetted from ink end")
      dispatch({type: "CHANGE_EDITING_INDEX", data: -1})
      return
    }
  }

  //END OF INK-CLICKED-MOUSE-MOVE
  function hamdleInkEnd(){
    var startPoint = activePoints[0];
    var endPoint = activePoints[activePoints.length - 1];
    var startNodeID = getNodeByPoint(startPoint, appState.config.nodes);
    var endNodeID = getNodeByPoint(endPoint, appState.config.nodes);

    if ((startNodeID !== -1) && (endNodeID !== -1)) {
      dispatch({type: "CHANGE_EDIT_MODE", data: "edge"})
      createEdgeInState(activePoints, appState.config.nodes[startNodeID].node, appState.config.nodes[endNodeID].node)
    } else if (startNodeID === -1) {
      dispatch({type: "CHANGE_EDIT_MODE", data: "node"})
      createNodeInState(endPoint);
    }
  }

  //END OF ERASE-CLICKED-MOUSE-MOVE
  function handleEraseEnd(){
    for(let i = 0; i < activePoints.length; i++){
      let nodeIndex = getNodeByPoint(activePoints[i], appState.config.nodes)
      if (nodeIndex !== -1){
        var nodes = appState.config.nodes
        let nodeID = nodes[nodeIndex].node.id
        nodes.splice(nodeIndex, 1)
        dispatch({type: "CHANGE_NODE", data: nodes})
        RemoveEdgesToNode(nodes, nodeID)
        return
      }
    }
  }

  function RemoveEdgesToNode(nodes: NodeElement[], nodeID: number){
    for(let i = 0; i < nodes.length; i++){
      for(let j = 0; j < nodes[i].edges.length; j++){
        if(nodes[i].edges[j].edge.to === nodeID){
          nodes[i].edges.splice(j, 1)
        }
      }
    }
    dispatch({type: "CHANGE_NODE", data: nodes})
  }



  //MOUSE-MOVE WHILE CLICKED
  function handleClickMove({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    let startPoint = prevPoint ?? currentPoint;

    if(appState.config.actionMode === "ink"){
      DrawInk(ctx, startPoint, currX, currY, lineColor)
    }
    if(appState.config.actionMode === "drag"){
      handleDrag(startPoint, currX, currY)
    }

    activePoints.push({
      x: startPoint.x,
      y: startPoint.y + 30,
    });
  }

  //CLICKED-MOUSE-MOVE DRAG
  function handleDrag(startPoint: Point, newX: number, newY: number){
    if(dragNode === -1){
        dragDetection(startPoint)
    }
    if(dragNode === -1){
      return
    }
    handleNodeDrag(newX, newY)
  }

  function dragDetection(startPoint: Point){
    if(startPoint === undefined){
      return
    }
    let nodes = appState.config.nodes
    let nodeIndex = getNodeByPoint(startPoint, nodes)
    if(nodeIndex !== -1){
      setDragNode(nodeIndex)
      dispatch({type: "CHANGE_EDIT_MODE", data: "node"})
      dispatch({type: "CHANGE_EDITING_INDEX", data: nodes[nodeIndex].node.id})
    }
  }

  function handleNodeDrag(newX: number, newY: number){
    let nodes = appState.config.nodes
    nodes[dragNode].node.pos.x = newX
    nodes[dragNode].node.pos.y = newY
    dispatch({type: "CHANGE_NODE", data: nodes})
    DrawGeometries()
  }



  //DECISIONS

  function decideMouseDownExit(): boolean{
    if(appState.config.actionMode === "drag"){
      return true
    }
    const canvas = canvasRef.current;
    // type guard
    if (!canvas) return true;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;
    ScaleCanvasForDevicePixelRatio(canvas, ctx);
    DrawGeometries()
    
    if (activePoints.length < 4) {
      return true;
    }
    if (appState.config.nodes === undefined){
      return true
    }
    return false
  }
}



function getNodeUID() {
  globalNodeID++;
  return globalNodeID;
}

function getEdgeUID() {
  globalEdgeID++;
  return globalEdgeID;
}