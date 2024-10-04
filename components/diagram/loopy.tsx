/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext, useRef } from "react";
import { Topbar } from "@/components/bars/topbar";
import {
  Edge,
  EdgeElement,
  NodeElement,
} from "@/datatypes/commondatatypes";
import { StateRadiusChange } from "@/datatypes/stateTransitions";
import { Draw, Point, useDraw } from "@/hooks/usedraw";
import { Node } from "@/datatypes/commondatatypes";
import { NodeComponent } from "./node";
import { AppContext } from "@/state/global";
import { IsPointInElement, DrawText , ScaleCanvasForDevicePixelRatio, GetPositionAlongArrow, EdgeCreationCalculation, CalculateEdgeRotationAndArc } from "@/functionality/geometry";
import { RefObject } from "react";
import { ColorCollection, MathCollection } from "@/datatypes/collections";
import { CreateDefaultNodeConfiguration, CreateDefaultEdgeConfiguration } from "@/functionality/creator";
import { getElementByPoint, getNodeByPoint, getNodeIdByPoint, getNodeIndexByID, isPointInCanvas } from "@/functionality/searcher";

var globalNodeID: number = 0;
var globalEdgeID: number = 0;
var activePoints: Point[] = [];
const lineColor = "#000"

export function Loopy() {

  const { canvasRef, onMouseDown, mouseClick, clear } = useDraw(drawLine);
  const [appState, dispatch] = useContext(AppContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    // type guard
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ScaleCanvasForDevicePixelRatio(canvas, ctx);
    DrawGeometries()

    if (activePoints.length < 4) {
      return;
    }
    if (appState.config.nodes === undefined){
      clear()
      activePoints = []
      return
    }

    switch(appState.config.actionMode){
      case "ink":
        hamdleInkUpdate()
        break
      case "text":
        handleTextUpdate()
        break
      case "drag":
        handleDragUpdate()
        break
      case "erase":
        handleEraseUpdate()
        break
    }

    clear()
    activePoints = []
  }, [onMouseDown]);

  useEffect(() => {
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
      dispatch({type: "CHANGE_EDITING_INDEX", data: -1})
      return
    }
  }, [mouseClick])

  useEffect(() => {
    //updateNode()
  }, [appState])

  return (
    <>
      <div className="pb-6">
        <Topbar/>
      </div>
        <div className="ml-8 mr-8 mt-28 mb-8">
          <canvas
            className={`w-[1200px] h-[800px]
               bg-[#28435a] 
               rounded-2xl border-t border-b bg-opacity-90
                  ${
                    appState.config.actionMode === "ink" && "cursor-[url('/resizedIcons/ink.png'),_pointer]" ||
                    appState.config.actionMode === "text" && "cursor-[url('/resizedIcons/text.png'),_pointer]" ||
                    appState.config.actionMode === "drag" && "cursor-[url('/resizedIcons/drag.png'),_pointer]" ||
                    appState.config.actionMode === "erase" && "cursor-[url('/resizedIcons/erase.png'),_pointer]"
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

function createNode(point: Point) {
    let node: Node = {
      id: getNodeUID(),
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
      config: CreateDefaultNodeConfiguration(),
      geometry: {
        circleRadius: 0,
        controlsAlpha: 0,
        controlsDirection: 0
      },
      edges: [],
    };
    appState.config.nodes.push(nodeElement);
    dispatch({type: "CHANGE_EDITING_INDEX", data: node.id})
    console.log("created node with: ", node.id)
  }

  function createEdge(strokePoints: Point[], startNode: Node, endNode: Node) {
    let [rotation, arc] = CalculateEdgeRotationAndArc(strokePoints, startNode, endNode)
    let [drawBase, labelBase, arrowBase] = EdgeCreationCalculation(startNode, endNode, arc, rotation)
    let edge: Edge = {
      id: getEdgeUID(),
      from: startNode.id,
      to: endNode.id,
      impact: 1,
    }
    let edgeElement: EdgeElement = {
      edge: edge,
      config: CreateDefaultEdgeConfiguration(),
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
    let nodes = appState.config.nodes
    let nodeIndex = getNodeIndexByID(startNode.id, appState.config.nodes)
    nodes[nodeIndex].edges.push(edgeElement)
    console.log("created edge to: ", edge.to)
    dispatch({type: "CHANGE_NODE", data: nodes})
    dispatch({type: "CHANGE_EDITING_INDEX", data: edge.id})
  }

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    let startPoint = prevPoint ?? currentPoint;
    if(appState.config.actionMode === "ink"){
      const lineWidth = 5;

      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      ctx.moveTo(startPoint.x, startPoint.y + 30);
      ctx.lineTo(currX, currY + 30);
      ctx.stroke();
  
      ctx.fillStyle = lineColor;
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y + 30, 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    activePoints.push({
      x: startPoint.x,
      y: startPoint.y + 30,
    });
  }

  function DrawGeometries(){
    if(appState.config.nodes === undefined){
      return
    }
    clear()
    for (let i = 0; i < appState.config.nodes.length; i++){
      DrawNode(i)
    }
    for (let i = 0; i < appState.config.nodes.length; i++){
      for (let j = 0; j < appState.config.nodes[i].edges.length; j++){
        DrawEdge(i, j)
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

  function DrawNode(index: number) {
    let ctx = canvasRef.current?.getContext("2d");
    if (ctx === undefined || ctx == null){
      return
    }
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }
    var x = Math.round(appState.config.nodes[index].node.pos.x) //.pos.x;
    var y = Math.round(appState.config.nodes[index].node.pos.y);
    var r = Math.round(appState.config.nodes[index].config.radius); //replace later
    var color = ColorCollection[appState.config.nodes[index].config.hue];

    // Translate!
    ctx.save();
    ctx.translate(x, y);
  
    // Synchronize & Visualize Editing
    if (appState.config.editingIndex == appState.config.nodes[index].node.id && appState.config.editMode === "node") {
      //Draw Highlight
      ctx.beginPath();
      ctx.arc(0, 0, r + 20, 0, MathCollection["tau"], false);
      ctx.fillStyle = ColorCollection[6];
      ctx.fill();
      //Take label
      
    }
  
    // White-gray bubble with colored border
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, MathCollection["tau"], false);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
    ctx.stroke();
  
    // RADIUS IS (ATAN) of VALUE?!?!?!
    var _r = Math.atan(appState.config.nodes[index].config.startValue * 5);
    _r = _r / (Math.PI / 2);
    _r = (_r + 1) / 2;
  
    // INFINITE RANGE FOR RADIUS
    // linear from 0 to 1, asymptotic otherwise.
    var _value = 4;
    if (appState.config.nodes[index].config.startValue >= 0 && appState.config.nodes[index].config.startValue <= 1) {
      // (0,1) -> (0.1, 0.9)
      _value = 0.1 + 0.8 * appState.config.nodes[index].config.startValue;
    } else {
      if (appState.config.nodes[index].node.value < 0) {
        // asymptotically approach 0, starting at 0.1
        _value = (1 / (Math.abs(appState.config.nodes[index].config.startValue) + 1)) * 0.1;
      }
      if (appState.config.nodes[index].config.startValue > 1) {
        // asymptotically approach 1, starting at 0.9
        _value = 1 - (1 / appState.config.nodes[index].config.startValue) * 0.1;
      }
    }
  
    // Colored bubble
    // for(let i = 0; i <= 100; i++){
    var _circleRadiusGoto = r * _value!; // radius
    var _circleRadius = 0
    while(_circleRadius < (_circleRadiusGoto - 2)){
      ctx.beginPath();
      _circleRadius = _circleRadius * 0.8 + _circleRadiusGoto * 0.2;
      ctx.arc(0, 0, _circleRadius, 0, MathCollection["tau"], false);
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Text!
    DrawText(ctx, appState.config.nodes[index].config.label, r)
  
    // WOBBLE CONTROLS
    var cl = 40;
    var cy = 0;
  
    // Controls!
    ctx.globalAlpha = appState.config.nodes[index].geometry.controlsAlpha;
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    // top arrow
    ctx.beginPath();
    ctx.moveTo(-cl, -cy - cl);
    ctx.lineTo(0, -cy - cl * 2);
    ctx.lineTo(cl, -cy - cl);
    ctx.lineWidth = appState.config.nodes[index].geometry.controlsDirection > 0 ? 10 : 3;
    ctx.stroke();
    // bottom arrow
    ctx.beginPath();
    ctx.moveTo(-cl, cy + cl);
    ctx.lineTo(0, cy + cl * 2);
    ctx.lineTo(cl, cy + cl);
    ctx.lineWidth = appState.config.nodes[index].geometry.controlsDirection < 0 ? 10 : 3;
    ctx.stroke();
  
    // Restore
    ctx.restore();
  }

  function DrawEdge(nodeIndex: number, edgeIndex: number){
    let ctx = canvasRef.current?.getContext("2d")
    if (ctx === undefined || ctx == null){
      return
    }
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    let startNode = appState.config.nodes[nodeIndex]
    let edge = startNode.edges[edgeIndex]
    if (edge.geometry.arc == 0) edge.geometry.arc = 0.1;

    // Width & Color
    ctx.lineWidth = 4 * Math.abs(edge.strength) - 2;
    ctx.strokeStyle = "#555";

    ctx.save();
    ctx.translate(edge.geometry.drawBase.f.x, edge.geometry.drawBase.f.y);
    ctx.rotate(edge.geometry.drawBase.f.a);
    
    // Highlight if in edit
    // console.log("a: ", edge.geometry.drawBase.a)
    // console.log("aa: ", edge.geometry.drawBase.aa)
    // console.log("w: ", edge.geometry.drawBase.w)
    // console.log("y2: ", edge.geometry.drawBase.y2)
    // console.log("r: ", edge.geometry.drawBase.r)
    if (edge.edge.id == appState.config.editingIndex && appState.config.editMode === "edge") {
      ctx.save();
      ctx.translate(edge.geometry.labelDrawBase.lp.x, edge.geometry.labelDrawBase.lp.y);
      ctx.rotate(-edge.geometry.drawBase.f.a);
      ctx.beginPath();
      ctx.arc(0, 5, 60, 0, MathCollection.TAU, false);
      ctx.fillStyle = ColorCollection[6];
      ctx.fill();
      ctx.restore();
    }

    // Arc it!
    ctx.beginPath();
    if (edge.geometry.arc > 0) {
      ctx.arc(edge.geometry.drawBase.w / 2, edge.geometry.drawBase.y2, edge.geometry.drawBase.r, edge.geometry.arrowDrawBase.startAngle, edge.geometry.arrowDrawBase.end, false);
    } else {
      ctx.arc(edge.geometry.drawBase.w / 2, edge.geometry.drawBase.y2, edge.geometry.drawBase.r, -edge.geometry.arrowDrawBase.startAngle, edge.geometry.arrowDrawBase.end, true);
    }
    // Arrow HEAD!
    ctx.save();
    ctx.translate(edge.geometry.drawBase.ap.x, edge.geometry.drawBase.ap.y);
    if (edge.geometry.arc < 0) ctx.scale(-1, -1);
    ctx.rotate(edge.geometry.drawBase.aa);
    ctx.moveTo(-edge.geometry.arrowDrawBase.arrowLength, -edge.geometry.arrowDrawBase.arrowLength);
    ctx.lineTo(0, 0);
    ctx.lineTo(-edge.geometry.arrowDrawBase.arrowLength, edge.geometry.arrowDrawBase.arrowLength);
    ctx.restore();

    // Stroke!
    ctx.stroke();

    // Draw label
    ctx.font = "100 60px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.save();
    ctx.translate(edge.geometry.labelDrawBase.lp.x, edge.geometry.labelDrawBase.lp.y);
    ctx.rotate(-edge.geometry.drawBase.f.a);
    ctx.fillStyle = "#888";
    ctx.fillText(edge.geometry.labelDrawBase.l, edge.geometry.labelDrawBase.labelXY.x, edge.geometry.labelDrawBase.labelXY.y);
    // if (edge.config.lowBound != -1) {
    //   var lowBoundImage = new Image();
    //   lowBoundImage.src = "/icons/tresholds/" + edge.config.lowBound + ".png";
    //   lowBoundImage.setAttribute("class", "lowBoundIcon");
    //   ctx.drawImage(lowBoundImage, -80, 35);
    // }
    // if (edge.config.upBound != -1) {
    //   var upBoundImage = new Image();
    //   upBoundImage.src = "/icons/tresholds/" + edge.config.upBound + ".png";
    //   upBoundImage.setAttribute("class", "upBoundIcon");
    //   ctx.drawImage(upBoundImage, 10, 35);
    // }
    ctx.restore();
    ctx.restore()
  }

  function hamdleInkUpdate(){
    var startPoint = activePoints[0];
    var endPoint = activePoints[activePoints.length - 1];
    var startNodeID = getNodeByPoint(startPoint, appState.config.nodes);
    var endNodeID = getNodeByPoint(endPoint, appState.config.nodes);

    if ((startNodeID !== -1) && (endNodeID !== -1)) {
      dispatch({type: "CHANGE_EDIT_MODE", data: "edge"})
      createEdge(activePoints, appState.config.nodes[startNodeID].node, appState.config.nodes[endNodeID].node)
    } else if (startNodeID === -1) {
      dispatch({type: "CHANGE_EDIT_MODE", data: "node"})
      createNode(endPoint);
    }
  }

  function handleTextUpdate(){

  }

  function handleDragUpdate(){

  }

  function handleEraseUpdate(){
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
    console.log("looking for nodeID: ", nodeID)
    for(let i = 0; i < nodes.length; i++){
      console.log("node: ", nodes[i].node.id)
      for(let j = 0; j < nodes[i].edges.length; j++){
        console.log("has edge to: ", nodes[i].edges[j].edge.to)
        if(nodes[i].edges[j].edge.to === nodeID){
          nodes[i].edges.splice(j, 1)
        }
      }
    }
    dispatch({type: "CHANGE_NODE", data: nodes})
  }

}
