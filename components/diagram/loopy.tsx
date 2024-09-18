/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { Topbar } from "@/components/bars/topbar";
import {
  Configuration,
  NodeConfiguration,
  NodeElement,
  NodeGeometry,
  Position,
} from "@/datatypes/commondatatypes";
import { StateRadiusChange } from "@/datatypes/stateTransitions";
import { Draw, Point, useDraw } from "@/hooks/usedraw";
import { Node } from "@/datatypes/commondatatypes";
import { NodeComponent } from "./node";
import { AppContext } from "@/state/global";
import { IsPointInNode, DrawText } from "@/functionality/geometry";
import { RefObject } from "react";
import { ColorCollection, MathCollection } from "@/datatypes/collections";

var globalID: number = 0;
var defaultConfiguration: Configuration = {
  editingMode : "ink",
  node: {
    id: 0,
    startValue: 0,
    label: "",
    hue: 0,
    radius: 50,
  },
  edge: undefined,
  geometries: []
};

var activePoints: Point[] = [];

function scaleCanvasForDevicePixelRatio(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale(dpr, dpr);
  }
}

export function Loopy() {

  const [color, setColor] = useState<string>("#000");
  const { canvasRef, onMouseDown, mouseClick, clear } = useDraw(drawLine);
  const [appState, dispatch] = useContext(AppContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    // type guard
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    scaleCanvasForDevicePixelRatio(canvas, ctx);
    DrawNodes()
    if (activePoints.length < 2) {
      return;
    }
    var startPoint = activePoints[0];
    var endPoint = activePoints[activePoints.length - 1];
    var startNodeID = getNodeByPoint(startPoint);
    var endNodeID = getNodeByPoint(endPoint);
    if ((startNodeID !== -1) && (endNodeID !== -1)) {
      // createEdge(activeNodes[startNodeID].node, activeNodes[endNodeID].node)
      return;
    } else if (startNodeID === -1) {
      createNode(endPoint);
    }
    clear();
    activePoints = [];
  }, [onMouseDown]);

  useEffect(() => {
    let nodeID = getNodeByPoint(mouseClick)
    if (nodeID !== -1){
      dispatch({type: "CHANGE_EDITING_INDEX", data: nodeID})
      dispatch({type: "CHANGE_NODE", data: appState.config.nodes[searchNodeIndexById(nodeID)].node})
      return
    }

    if (isPointInCanvas(mouseClick)){
      dispatch({type: "CHANGE_EDITING_INDEX", data: -1})
      dispatch({type: "CHANGE_NODE", data: defaultConfiguration.node})
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
        <div className="pl-8 pr-8 2 pt-28 pb-8">
          <canvas
            className={`w-[1200px] h-[800px] bg-[#28435a] rounded-2xl border-t border-b bg-opacity-90
                  ${
                    appState.config.editMode === "ink" && "cursor-[url('/resizedIcons/ink.png'),_pointer]" ||
                    appState.config.editMode === "text" && "cursor-[url('/resizedIcons/text.png'),_pointer]" ||
                    appState.config.editMode === "drag" && "cursor-[url('/resizedIcons/drag.png'),_pointer]" ||
                    appState.config.editMode === "erase" && "cursor-[url('/resizedIcons/erase.png'),_pointer]"
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

function createEdge(startNode: Node, endNode: Node) {}

function createNode(point: Point) {
    let node: Node = {
      id: getUID(),
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
      config: defaultConfiguration.node!,
      geometry: {
        circleRadius: 0,
        controlsAlpha: 0,
        controlsDirection: 0
      },
      edges: [],
    };
    appState.config.nodes.push(nodeElement);
    dispatch({type: "CHANGE_EDITING_INDEX", data: node.id})
    dispatch({type: "CHANGE_NODE", data: node})
  }

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    if (appState.config.editIndex !== -1) {
      // setEditingIndex(-1);
    }
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
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
    activePoints.push({
      x: startPoint.x,
      y: startPoint.y + 30,
    });
  }

  function DrawNodes(){
    if(appState.config.nodes === undefined){
      return
    }
    clear()
    for (let i = 0; i < appState.config.nodes.length; i++){
      DrawNode(i)
    }
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

    console.log(appState.config.nodes[index].config.label)

    // Translate!
    ctx.save();
    ctx.translate(x, y);
  
    // DRAW HIGHLIGHT???
    if (appState.config.editingIndex == appState.config.nodes[index].node.id) {
      ctx.beginPath();
      ctx.arc(0, 0, r + 20, 0, MathCollection["tau"], false);
      ctx.fillStyle = ColorCollection[6];
      ctx.fill();
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
    var _r = Math.atan(appState.config.nodes[index].node.value * 5);
    _r = _r / (Math.PI / 2);
    _r = (_r + 1) / 2;
  
    // INFINITE RANGE FOR RADIUS
    // linear from 0 to 1, asymptotic otherwise.
    var _value = 4;
    if (appState.config.nodes[index].node.value >= 0 && appState.config.nodes[index].node.value <= 1) {
      // (0,1) -> (0.1, 0.9)
      _value = 0.1 + 0.8 * appState.config.nodes[index].node.value;
    } else {
      if (appState.config.nodes[index].node.value < 0) {
        // asymptotically approach 0, starting at 0.1
        _value = (1 / (Math.abs(appState.config.nodes[index].node.value) + 1)) * 0.1;
      }
      if (appState.config.nodes[index].node.value > 1) {
        // asymptotically approach 1, starting at 0.9
        _value = 1 - (1 / appState.config.nodes[index].node.value) * 0.1;
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
      console.log(_circleRadius)
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

  function getNodeByPoint(point: Position): number {
    if(appState.config.nodes === undefined){
      return -1
    }
    for(let i = 0; i < appState.config.nodes.length; i++){
      if(IsPointInNode(point, appState.config.nodes[i].node.pos, 50)){
        return appState.config.nodes[i].node.id
      }
    }
    return -1
  }

  function isPointInCanvas(point: Position): boolean {
    if(point.y < 0){
      return false
    }
    return true
  }

  function updateNode() {
    if(appState.config.editingIndex === undefined || appState.config.editingIndex === -1 || appState.config.node === undefined){
      return
    }
    // console.log('editingIndex for update: ', editingIndex)
    let config = appState.config.node 
   // console.log("updated with: ", config)
   appState.config.nodes[appState.config.editingIndex - 1].config = config;
    //DrawNodes()
  }

  function searchNodeIndexById(id: number) {
    for(let i = 0; i < appState.config.nodes.length; i++){
      if(appState.config.nodes[i].node.id == id){
        return i
      }
    }
    return 0
  }

  function getUID() {
    globalID++;
    return globalID;
  }
}
