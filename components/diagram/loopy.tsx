/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { Topbar } from "@/components/bars/topbar";
import {
  NodeElement, EdgeElement, EdgeReference
} from "@/datatypes/commondatatypes";
import { DrawNode } from "@/functionality/draw/drawNode";
import { DrawEdge } from "@/functionality/draw/drawEdge";
import { Draw, Point, useClickMove } from "@/hooks/usedraw";
import { Node } from "@/datatypes/commondatatypes";
import { AppContext } from "@/state/global";
import { CascadeNodeDragToEdges, DragFromToEdge, DragSelfToSelfEdge, ScaleCanvasForDevicePixelRatio } from "@/functionality/geometry";
import { CreateEdgeElement, CreateNodeElement } from "@/functionality/creator";
import { getEdgeByPoint, getElementByPoint, getNodeByPoint, getNodeIndexByID, isPointInCanvas } from "@/functionality/searcher";
import { DrawInk } from "@/functionality/draw/drawInk";

var globalNodeID: number = 0;
var globalEdgeID: number = 0;
var activePoints: Point[] = [];
var preventClickAction = false;
const lineColor = "#FFF"

export function Loopy() {

  const { canvasRef, onMouseDown, mouseClick, windowClick, clear } = useClickMove(handleClickMove);
  const [dragNode, setDragNode] = useState(-1)
  const [dragEdge, setDragEdge] = useState(-1)
  const [appState, dispatch] = useContext(AppContext);

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
    DrawGeometries()
  }, [appState])

  return (
    <>
      <div className="pb-6">
        <Topbar/>
      </div>
        <div className="ml-8 mr-8 mt-28 mb-8">
          <canvas
            className={`w-[1200px] h-[800px]
               bg-[#1c1d1d] 
               rounded-2xl border-4 border-stone-300 bg-opacity-90
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
            height={800}
          >
          </canvas>
        </div>
    </>
  );

  function createNodeInState(point: Point) {
    let nodeUID = getNodeUID()
    let nodeElement = CreateNodeElement(point, nodeUID)
    appState.config.nodes.push(nodeElement);
    dispatch({type: "CHANGE_EDITING_INDEX", data: nodeElement.node.id})
  }

  function createEdgeInState(points: Point[], startNode: Node, endNode: Node) {
    let edgeUID = getEdgeUID()
    let edgeElement = CreateEdgeElement(points, startNode, endNode, edgeUID)
    let nodes = appState.config.nodes
    let nodeIndex = getNodeIndexByID(startNode.id, appState.config.nodes)
    let endNodeIndex = getNodeIndexByID(endNode.id, appState.config.nodes)
    nodes[nodeIndex].edges.push(edgeElement)
    nodes[endNodeIndex].edgeReferences.push({
      node: nodeIndex,
      edge: nodes[nodeIndex].edges.length - 1
    })    
    dispatch({type: "CHANGE_EDITING_INDEX", data: appState.config.nodes[nodeIndex].node.id})
    dispatch({type: "CHANGE_EDGE_EDITING_INDEX", data: edgeElement.edge.id})
    dispatch({type: "EDIT", data: nodes})
  }

  function DrawGeometries(){
    if(appState.config.nodes === undefined){
      return
    }
    let ctx = canvasRef.current?.getContext("2d")
    if (ctx === undefined || ctx == null){
      return
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    let editingIndex = appState.config.editingIndex
    let edgeEditingIndex = appState.config.edgeEditingIndex
    let editMode = appState.config.editMode
    clear()
    for (let i = 0; i < appState.config.nodes.length; i++){
      for (let j = 0; j < appState.config.nodes[i].edges.length; j++){
        DrawEdge(ctx, appState.config.nodes[i].edges[j], edgeEditingIndex, editMode)
      }
    }
    for (let i = 0; i < appState.config.nodes.length; i++){
      DrawNode(ctx, appState.config.nodes[i], editingIndex, editMode)
    }
  }



  //Mouse-Action-Handlers 


  //MOUSE-CLICK

  //DRAG-CLICK || END OF DRAG-CLICKED-MOUSE-MOVE
  function handleDragClick(){
    //End of Drag
    if(dragNode !== -1){
      clear()
      activePoints = []
      setDragNode(-1)
      setDragEdge(-1)
      DrawGeometries()
      return
    }

    //Node Clicked
    let nodeIndex = getNodeByPoint({x: mouseClick.x, y: mouseClick.y}, appState.config.nodes)
    if(nodeIndex !== -1){
      dispatch({type: "CHANGE_EDIT_MODE", data: "node"})
      dispatch({type: "CHANGE_EDITING_INDEX", data: appState.config.nodes[nodeIndex].node.id})
      return
    }

    //Edge licked
    let [edgeNodeIndex, edgeIndex] = getEdgeByPoint({x: mouseClick.x, y: mouseClick.y}, appState.config.nodes)
    if(edgeNodeIndex !== -1 ){
      dispatch({type: "CHANGE_EDIT_MODE", data: "edge"})
      dispatch({type: "CHANGE_EDITING_INDEX", data: appState.config.nodes[edgeNodeIndex].node.id})
      dispatch({type: "CHANGE_EDGE_EDITING_INDEX", data: appState.config.nodes[edgeNodeIndex].edges[edgeIndex].edge.id})
      return
    }

    //Canvas clicked
    if (isPointInCanvas(mouseClick) && windowClick.y > 120){
      dispatch({type: "CHANGE_EDITING_INDEX", data: -1})
      DrawGeometries()
    }
  }

  //INK-CLICK
  function handleInkClick(){
    if(appState.config.nodes === undefined || preventClickAction === true){
      console.log("returned from prevention")
      preventClickAction = false
      return
    }
    let [type, nodeID, edgeID] = getElementByPoint(mouseClick, appState.config.nodes)
    if (nodeID !== 0 && edgeID !== 0 && type === "node"){
      dispatch({type: "CHANGE_EDIT_MODE", data: "node"})
      dispatch({type: "CHANGE_EDITING_INDEX", data: nodeID})
      return
    }
    else if (nodeID !== 0 && type === "edge"){
      dispatch({type: "CHANGE_EDIT_MODE", data: "edge"})
      dispatch({type: "CHANGE_EDITING_INDEX", data: nodeID})
      dispatch({type: "CHANGE_EDGE_EDITING_INDEX", data: edgeID})
      return
    }
    if (isPointInCanvas(mouseClick) && windowClick.y > 120){
      dispatch({type: "CHANGE_EDITING_INDEX", data: -1})
      dispatch({type: "CHANGE_EDGE_EDITING_INDEX", data: -1})
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
      preventClickAction = true
      console.log("setted prevent")
      createEdgeInState(activePoints, appState.config.nodes[startNodeID].node, appState.config.nodes[endNodeID].node)
      dispatch({type: "CHANGE_EDIT_MODE", data: "edge"})
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
        dispatch({type: "EDIT", data: nodes})
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
    dispatch({type: "EDIT", data: nodes})
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
    if(dragNode === -1 && dragEdge === -1){
      return
    }
    if(dragEdge === -1){
      handleNodeDrag(newX, newY)
      return
    }
    let nodes = appState.config.nodes
    let edge = nodes[dragNode].edges[dragEdge].edge
    if(edge.from === edge.to){
      handleEdgeDrag(newX, newY, true)
    }else{
      handleEdgeDrag(newX, newY, false)
    }
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
      return
    }
    let [edgeNodeIndex, edgeIndex] = getEdgeByPoint(startPoint, nodes)
    if(edgeNodeIndex !== -1){
      setDragEdge(edgeIndex)
      setDragNode(edgeNodeIndex)
      dispatch({type: "CHANGE_EDIT_MODE", data: "edge"})
      dispatch({type: "CHANGE_EDITING_INDEX", data: appState.config.nodes[edgeNodeIndex].node.id})
      dispatch({type: "CHANGE_EDGE_EDITING_INDEX", data: appState.config.nodes[edgeNodeIndex].edges[edgeIndex].edge.id})
    }
  }

  function handleNodeDrag(newX: number, newY: number){
    let nodes = appState.config.nodes
    nodes[dragNode].node.pos.x = newX
    nodes[dragNode].node.pos.y = newY
    nodes = CascadeNodeDragToEdges(dragNode, nodes)
    dispatch({type: "EDIT", data: nodes})
    DrawGeometries()
  }

  function handleEdgeDrag(newX: number, newY: number, self: boolean){
    let nodes = appState.config.nodes
    let edge = nodes[dragNode].edges[dragEdge]
    let fromNode = nodes[getNodeIndexByID(edge.edge.from, nodes)].node
    let toNode = nodes[getNodeIndexByID(edge.edge.to, nodes)].node
    if(self){
      nodes[dragNode].edges[dragEdge] = DragSelfToSelfEdge(edge, fromNode, toNode, newX, newY, )
    }else{
      nodes[dragNode].edges[dragEdge] = DragFromToEdge(edge, fromNode, toNode, newX, newY)
    }
    dispatch({type: "EDIT", data: nodes})
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