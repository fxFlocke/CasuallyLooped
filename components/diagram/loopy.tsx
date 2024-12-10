/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { Topbar } from "@/components/bars/topbar";
import {
  NodeElement, EdgeElement, EdgeReference,
  TextElement,
  Signal,
  EdgeGeometry
} from "@/datatypes/commondatatypes";
import { DrawNode } from "@/functionality/draw/drawNode";
import { DrawEdge } from "@/functionality/draw/drawEdge";
import { Draw, Point, useClickMove } from "@/hooks/usedraw";
import { Node } from "@/datatypes/commondatatypes";
import { AppContext } from "@/state/global";
import { CascadeNodeDragToEdges, DragFromToEdge, DragSelfToSelfEdge, GetArrowLength, IsPointInUpperHalf, ScaleCanvasForDevicePixelRatio, ScaleElements } from "@/functionality/geometry";
import { CreateEdgeElement, CreateNodeElement } from "@/functionality/creator";
import { getEdgeByID, getEdgeByPoint, getEdgeIndexByID, getElementByPoint, getNodeByID, getNodeByPoint, getNodeIndexByID, getNoteByPoint, GetSignalCountOnEdge, isPointInCanvas } from "@/functionality/searcher";
import { DrawErase, DrawInk } from "@/functionality/draw/drawInk";
import { DrawNote } from "@/functionality/draw/drawText";
import { DrawSignal } from "@/functionality/draw/drawSignal";

var globalNodeID: number = 0;
var globalEdgeID: number = 0;
var activePoints: Point[] = [];
var preventClickAction = false;
var textClicked = false
var textClickTime = 0
const lineColor = "#FFF"

export const Loopy: React.FC = () => {

  const { canvasRef, onMouseDown, mouseClick, mouseMove, windowClick, clear, zoom } = useClickMove(handleClickMove);
  const [dragNode, setDragNode] = useState(-1)
  const [dragEdge, setDragEdge] = useState(-1)
  const [dragText, setDragText] = useState(-1)
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
      case "text":
        handleTextClick()
        break
      case "simulate":
        handleSimulateClick()
        break
    }
  }, [mouseClick])

  useEffect(() => {
    handleControlHover()
  }, [mouseMove])

  useEffect(() => {
    if(appState.config.editMode !== "simulate"){
      DrawGeometries()
    }else{
      DrawSimulation()
    }
  }, [appState])

  return (
    <>
      <div className="pb-6">
        <Topbar/>
      </div>
        <div className="ml-8 mr-8 mt-28 mb-8">
          <canvas
            className={`w-full
               bg-[#1c1d1d] 
               rounded-2xl border-4 border-stone-300 bg-opacity-90
                  ${
                    appState.config.actionMode === "ink" && "cursor-[url('/icons/whitePencil.png'),_pointer]" ||
                    appState.config.actionMode === "text" && "cursor-[url('/icons/whiteText.png'),_pointer]" ||
                    (appState.config.actionMode === "drag" && dragNode === -1 && dragText === -1) && "cursor-[url('/icons/whiteHand.png'),_pointer]" ||
                    (appState.config.actionMode === "drag" && (dragNode !== -1 || dragText !== -1)) && "cursor-[url('/icons/whiteHandClenched.png'),_pointer]" ||
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
      node: nodes[nodeIndex].node.id,
      edge: edgeElement.edge.id
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
    for(let i = 0; i < appState.config.texts.length; i++){
      let text = appState.config.texts[i]
      if(appState.config.editMode === "text" && (appState.config.editingIndex) === i){
        DrawNote(ctx, text.text, text.pos.x, text.pos.y, true)
      }else{
        DrawNote(ctx, text.text, text.pos.x, text.pos.y, false)
      }
    }
    for (let i = 0; i < appState.config.nodes.length; i++){
      for (let j = 0; j < appState.config.nodes[i].edges.length; j++){
        DrawEdge(ctx, appState.config.nodes[i].edges[j], edgeEditingIndex, editMode)
      }
    }
    for (let i = 0; i < appState.config.nodes.length; i++){
      DrawNode(ctx, appState.config.nodes[i], editingIndex, editMode, appState.config.actionMode)
    }
  }

  function DrawSimulation(){
    if(appState.config.nodes === undefined){
      return
    }
    let ctx = canvasRef.current?.getContext("2d")
    if (ctx === undefined || ctx == null){
      return
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    let nodes = appState.config.nodes
    let signals = appState.config.signals
    let editingIndex = -1
    let edgeEditingIndex = -1
    let editMode = ""
    clear()
    for(let i = 0; i < appState.config.texts.length; i++){
      let text = appState.config.texts[i]
      if(appState.config.editMode === "text" && (appState.config.editingIndex) === i){
        DrawNote(ctx, text.text, text.pos.x, text.pos.y, true)
      }else{
        DrawNote(ctx, text.text, text.pos.x, text.pos.y, false)
      }
    }
    for (let i = 0; i < appState.config.nodes.length; i++){
      for (let j = 0; j < appState.config.nodes[i].edges.length; j++){
        DrawEdge(ctx, appState.config.nodes[i].edges[j], edgeEditingIndex, editMode, signals, nodes)
      }
    }
    for (let i = 0; i < appState.config.nodes.length; i++){
      DrawNode(ctx, appState.config.nodes[i], editingIndex, editMode, appState.config.actionMode)
    }

    if(signals.length > 0){
      for(let k = 0; k < signals.length; k++){
        let node = getNodeByID(signals[k].identifiers.nodeID, nodes)
        let edgeIndex = getEdgeIndexByID(signals[k].identifiers.edgeID, node!.edges)
        signals = updateSignal(signals, k, node!.edges[edgeIndex])
      }
      dispatch({type: "EDIT_SIGNALS", data: signals})
    }

  }

  //Mouse-Action-Handlers 


  //MOUSE-CLICK

  //DRAG-CLICK || END OF DRAG-CLICKED-MOUSE-MOVE
  function handleDragClick(){
    //End of Drag
    if(dragNode !== -1 || dragText !== -1){
      clear()
      activePoints = []
      setDragNode(-1)
      setDragEdge(-1)
      setDragText(-1)
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

    //Edge Clicked
    let [edgeNodeIndex, edgeIndex] = getEdgeByPoint({x: mouseClick.x, y: mouseClick.y}, appState.config.nodes)
    if(edgeNodeIndex !== -1 ){
      dispatch({type: "CHANGE_EDIT_MODE", data: "edge"})
      dispatch({type: "CHANGE_EDITING_INDEX", data: appState.config.nodes[edgeNodeIndex].node.id})
      dispatch({type: "CHANGE_EDGE_EDITING_INDEX", data: appState.config.nodes[edgeNodeIndex].edges[edgeIndex].edge.id})
      return
    }

    //Text Clicked
    let noteIndex = getNoteByPoint({ x: mouseClick.x, y: mouseClick.y }, appState.config.texts)
    if(noteIndex !== -1){
      dispatch({type: "CHANGE_EDIT_MODE", data: "text"})
      dispatch({type: "CHANGE_EDITING_INDEX", data: noteIndex})
      return
    }

    //Canvas clicked
    if (isPointInCanvas(mouseClick) && windowClick.y > 120){
      dispatch({type: "CHANGE_EDITING_INDEX", data: -1})
      dispatch({type: "CHANGE_EDGE_EDITING_INDEX", data: -1})
      DrawGeometries()
    }
  }

  //INK-CLICK
  function handleInkClick(){
    if(appState.config.nodes === undefined || preventClickAction === true){
      preventClickAction = false
      return
    }
    let [type, nodeID, edgeID] = getElementByPoint(mouseClick, appState.config.nodes)
    if (nodeID !== 0 && type === "node"){
      dispatch({type: "CHANGE_EDIT_MODE", data: "node"})
      dispatch({type: "CHANGE_EDITING_INDEX", data: nodeID})
      return
    }
    else if (nodeID !== 0 && edgeID !== 0 && type === "edge"){
      dispatch({type: "CHANGE_EDIT_MODE", data: "edge"})
      dispatch({type: "CHANGE_EDITING_INDEX", data: nodeID})
      dispatch({type: "CHANGE_EDGE_EDITING_INDEX", data: edgeID})
      return
    }

    let textIndex = getNoteByPoint(mouseClick, appState.config.texts)
    if(textIndex !== -1){
      dispatch({type: "CHANGE_EDIT_MODE", data: "text"})
      dispatch({type: "CHANGE_EDITING_INDEX", data: textIndex})
      return
    }
    
    if (isPointInCanvas(mouseClick) && windowClick.y > 120){
      dispatch({type: "CHANGE_EDITING_INDEX", data: -1})
      dispatch({type: "CHANGE_EDGE_EDITING_INDEX", data: -1})
      return
    }
  }

  //Text-Click
  function handleTextClick(){
    let [type, nodeID, edgeID] = getElementByPoint(mouseClick, appState.config.nodes)
    if(type === "notInCanvas" || nodeID !== 0){
      return
    }

    let textIndex = getNoteByPoint(mouseClick, appState.config.texts)
    if(textIndex !== -1){
      dispatch({type: "CHANGE_EDITING_INDEX", data: textIndex})
    }

    if((textClickTime - new Date().getTime()) < -500){
      textClicked = true
      textClickTime = new Date().getTime()
      return
    }

    if(!textClicked){
      return
    }

    let text: TextElement = {
      text: "text...",
      pos: {
        x: mouseClick.x,
        y: mouseClick.y
      }
    }
    let texts = appState.config.texts
    texts.push(text)
    dispatch({type: "CHANGE_EDITING_INDEX", data: texts.length - 1})
    dispatch({type: "EDIT_TEXTS", data: texts})
    textClicked = false
  }

  function handleSimulateClick(){
    let nodes = appState.config.nodes
    let nodeIndex = getNodeByPoint({ x: mouseMove.x, y: mouseMove.y }, nodes)
    if(nodeIndex === -1){
      return
    }
    let signal = IsPointInUpperHalf({ x: mouseMove.x, y: mouseMove.y }, nodes[nodeIndex].node.pos, 30)
    if(signal !== 0){
      if(appState.config.editMode !== "simulate"){
        dispatch({type: "CHANGE_EDIT_MODE", data: "simulate"})
      }
      takeSignal(nodeIndex, (signal * 0.16))
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
        let node = nodes[nodeIndex]
        RemoveEdgesToNode(nodes, node.edgeReferences)
        RemoveEdgesFromReferences(nodes, node.edges)
        nodes.splice(nodeIndex, 1)
        dispatch({type: "CHANGE_EDITING_INDEX", data: -1})
        dispatch({type: "CHANGE_EDGE_EDITING_INDEX", data: -1})
        dispatch({type: "EDIT", data: nodes})
      }
      let [edgeNodeIndex, edgeIndex] = getEdgeByPoint(activePoints[i], appState.config.nodes)
      if(edgeNodeIndex !== -1){
        var nodes = appState.config.nodes
        let edgeID = nodes[edgeNodeIndex].edges[edgeIndex].edge.id
        let toID = nodes[edgeNodeIndex].edges[edgeIndex].edge.to
        let toIndex = getNodeIndexByID(toID, nodes)
        nodes[toIndex] = RemoveEdgeReferenceFromNode(nodes[toIndex], edgeID)
        nodes[edgeNodeIndex].edges.splice(edgeIndex, 1)
        dispatch({type: "CHANGE_EDITING_INDEX", data: -1})
        dispatch({type: "CHANGE_EDGE_EDITING_INDEX", data: -1})
        dispatch({type: "EDIT", data: nodes})
      }
      let textIndex = getNoteByPoint(activePoints[i], appState.config.texts)
      if(textIndex !== -1){
        let texts = appState.config.texts
        texts.splice(textIndex, 1)
        dispatch({type: "CHANGE_EDITING_INDEX", data: -1})
        dispatch({type: "EDIT_TEXTS", data: texts})
      }
    }
  }

  function RemoveEdgesToNode(nodes: NodeElement[], edgeReferences: EdgeReference[]){
    for(let i = 0; i < edgeReferences.length; i++){
      let nodeIndex = getNodeIndexByID(edgeReferences[i].node, nodes)
      if(nodeIndex === -1){
        continue
      }
      let edgeIndex = getEdgeIndexByID(edgeReferences[i].edge, nodes[nodeIndex].edges)
      if(edgeIndex === -1){
        continue
      }
      nodes[nodeIndex].edges.splice(edgeIndex, 1)
    }
    dispatch({type: "EDIT", data: nodes})
  }

  function RemoveEdgesFromReferences(nodes: NodeElement[], edges: EdgeElement[]){
    for(let i = 0; i < edges.length; i++){
      let nodeIndex = getNodeIndexByID(edges[i].edge.to, nodes)
      if(nodeIndex === -1){
        continue
      }
      for(let j = 0; j < nodes[nodeIndex].edgeReferences.length; j++){
        if(nodes[nodeIndex].edgeReferences[j].node === edges[i].edge.from){
          nodes[nodeIndex].edgeReferences.splice(j, 1)
        }
      }
    }
    dispatch({type: "EDIT", data: nodes})
  }

  function RemoveEdgeReferenceFromNode(node: NodeElement, edgeID: number){
    for(let i = 0; i < node.edgeReferences.length; i++){
      if(node.edgeReferences[i].edge === edgeID){
        node.edgeReferences.splice(i, 1)
        return node
      }
    }
  }

  //MOUSE-MOVE WHILE CLICKED
  function handleClickMove({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    let startPoint = prevPoint ?? currentPoint;

    if(appState.config.actionMode === "ink"){
      DrawInk(ctx, startPoint, currX, currY, lineColor)
    }
    if(appState.config.actionMode === "erase"){
      DrawErase(ctx, startPoint, currX, currY, lineColor)
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
    // if(appState.config.editMode === "text"){
      handleTextDrag(startPoint, newX, newY)
    // }
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

  function handleTextDrag(startPoint: Point, newX: number, newY: number){
    let texts = appState.config.texts
    if(dragText === -1){
      let textIndex = getNoteByPoint(startPoint, texts)
      if(textIndex !== -1){
        setDragText(textIndex)
        dispatch({type: "CHANGE_EDIT_MODE", data: "text"})
        dispatch({type: "CHANGE_EDITING_INDEX", data: textIndex})
      }
      return
    }
    texts[dragText].pos.x = newX
    texts[dragText].pos.y = newY
    dispatch({type: "EDIT_TEXTS", data: texts})
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

  //Simulation

  function takeSignal(nodeIndex: number, strength: number){
    let nodes = appState.config.nodes
    let signals = appState.config.signals
    nodes[nodeIndex].config.startValue = decideNodeValue(nodes[nodeIndex].config.startValue,  strength)
    dispatch({type: "EDIT", data: nodes})
    DrawGeometries()
    for(let i = 0; i < nodes[nodeIndex].edges.length; i++){
      let edge = nodes[nodeIndex].edges[i].edge
      let signalCount = GetSignalCountOnEdge(signals, edge.id)
      if(signalCount < 5){
        if((edge.allowance === 1 || edge.allowance === 0) && (strength > 0) ){
          sendSignal(edge.from, edge.id, edge.to, edge.impact)
        } else if ((edge.allowance === -1 || edge.allowance === 0) && (strength < 0)){
          sendSignal(edge.from, edge.id, edge.to, edge.impact)
        }
      }
    }
  }

  function sendSignal(nodeID: number, edgeID: number, receiverID: number, impact: number){
    let signal: Signal = {
      identifiers: {
        strength: impact,
        nodeID: nodeID,
        edgeID: edgeID,
        receiverID: receiverID,
      },
      delta: decideDelta(impact),
      position: 0,
      scale: Math.abs(decideDelta(impact)),
    } 
    let signals = appState.config.signals
    signals.push(signal)
    dispatch({type: "EDIT_SIGNALS", data: signals})
  }

  function updateSignal(signals: Signal[], signalIndex: number, edge: EdgeElement): Signal[]{
    let arrowLength = GetArrowLength(edge)
    let nodes = appState.config.nodes
    if(signals[signalIndex].position >= 1){
      let signal = signals[signalIndex]
      signals.splice(signalIndex, 1)
      let nodeIndex = getNodeIndexByID(signal.identifiers.receiverID, nodes)
      takeSignal(nodeIndex, signal.identifiers.strength)
    } else {
      signals[signalIndex].position += (1  / (arrowLength * 3 * decideSpeed()))
    }
    return signals
  }

  function handleControlHover(){
    let nodes = appState.config.nodes
    let nodeIndex = getNodeByPoint({ x: mouseMove.x, y: mouseMove.y }, nodes)
    if(nodeIndex === -1){
      resetControlDirections()
      return
    }
    let hoverUpper = IsPointInUpperHalf({ x: mouseMove.x, y: mouseMove.y }, nodes[nodeIndex].node.pos, 30)
    if(hoverUpper === 1){
      nodes[nodeIndex].geometry.controlsDirection = 1
    }else if (hoverUpper === -1){
      nodes[nodeIndex].geometry.controlsDirection = -1
    }
    dispatch({type: "EDIT", data: nodes})
    DrawGeometries()
  }

  function resetControlDirections(){
    let nodes = appState.config.nodes
    for(let i = 0; i < nodes.length; i++){
      nodes[i].geometry.controlsDirection = 0
    }
    dispatch({type: "EDIT", data: nodes})
  }

  //DECISIONS
  function decideMouseDownExit(): boolean{
    if(appState.config.actionMode === "drag" || appState.config.actionMode === "simulate"){
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

  function decideDelta(impact: number){
   if(impact < 0){
    return -0.33
   } else{
    return 0.33
   }
  }

  function decideNodeValue(value: number, signal: number): number {
    if((value + (signal * 0.16)) > 1){
      return 1
    } else if ((value + (signal * 0.16)) < 0){
      return 0
    }
    return (value + (signal * 0.16))
   }

   function decideSpeed(){
    switch(appState.config.simulationSpeed){
      case "0":
        return 100
      case "10":
        return 5
      case "20":
        return 2
      case "30":
        return 1.5
      case "40":
        return 1.2
      case "50":
        return 1
      case "60":
        return 0.8
      case "70":
        return 0.6
      case "80":
        return 0.4
      case "90":
        return 0.2
      case "100":
        return 0.1
      default:
        return 1
      }
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