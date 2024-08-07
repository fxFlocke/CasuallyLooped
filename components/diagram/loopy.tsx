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
import { Draw, Point, useDraw } from "@/hooks/usedraw";
import { Node } from "@/datatypes/commondatatypes";
import { NodeComponent } from "./node";
import { AppContext } from "@/state/global";
import { IsPointInNode } from "@/functionality/geometry";
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

var activeNodes: NodeElement[] = [];
var activePoints: Point[] = [];
var editingIndex: number = -1;

export function Loopy() {

  const [nodesChanged, setNodesChanged] = useState(false);
  const [color, setColor] = useState<string>("#000");
  const { canvasRef, onMouseDown, mouseClick, clear } = useDraw(drawLine);
  const [appState, dispatch] = useContext(AppContext);

  useEffect(() => {
    DrawNodes()
    if (activePoints.length < 2) {
      return;
    }
    var startPoint = activePoints[0];
    var endPoint = activePoints[activePoints.length - 1];
    var startNodeID = getNodeByPoint(startPoint);
    var endNodeID = getNodeByPoint(endPoint);
    if ((startNodeID !== -1) && (endNodeID !== -1)) {
      createEdge(activeNodes[startNodeID].node, activeNodes[endNodeID].node)
      return;
    } else if (startNodeID === -1) {
      createNode(endPoint);
    }
    clear();
    activePoints = [];
  }, [onMouseDown]);

  useEffect(() => {
    if(activeNodes !== undefined){
      let nodeID = getNodeByPoint(mouseClick)
      if(nodeID !== -1){
        editingIndex = nodeID
        dispatch({type: "CHANGE_NODE", data: activeNodes[searchNodeIndexById(nodeID)].node})
      }else{
        editingIndex = -1
        DrawNodes()
      }
    }
  }, [mouseClick])

  return (
    <>
      <div className="pb-6">
        <Topbar/>
      </div>
        <div className="pl-8 pr-8 2 pt-28 pb-8">
          <canvas
            className="cursor-[url('/resizedIcons/ink.png'),_pointer] w-[1200px] h-[800px] bg-[#28435a] rounded-2xl border-t border-b bg-opacity-90"
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
      value: 0,
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
    activeNodes.push(nodeElement);
    console.log(editingIndex)
    editingIndex = node.id;
    console.log(editingIndex)
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
    clear()
    for (let i = 0; i < activeNodes.length; i++){
      DrawNode(i)
    }
  }

  function DrawNode(index: number) {
    let ctx = canvasRef.current!.getContext("2d");
    if (ctx === null) {
      return;
    }
    var x = activeNodes[index].node.pos.x //.pos.x;
    var y = activeNodes[index].node.pos.y;
    var r = activeNodes[index].config.radius; //replace later
    var color = ColorCollection[activeNodes[index].config.hue];
  
    // Translate!
    ctx.save();
    ctx.translate(x, y);
  
    // DRAW HIGHLIGHT???
    if (editingIndex == activeNodes[index].node.id) {
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
    var _r = Math.atan(activeNodes[index].node.value * 5);
    _r = _r / (Math.PI / 2);
    _r = (_r + 1) / 2;
  
    // INFINITE RANGE FOR RADIUS
    // linear from 0 to 1, asymptotic otherwise.
    var _value;
    if (activeNodes[index].node.value >= 0 && activeNodes[index].node.value <= 1) {
      // (0,1) -> (0.1, 0.9)
      _value = 0.1 + 0.8 * activeNodes[index].node.value;
    } else {
      if (activeNodes[index].node.value < 0) {
        // asymptotically approach 0, starting at 0.1
        _value = (1 / (Math.abs(activeNodes[index].node.value) + 1)) * 0.1;
      }
      if (activeNodes[index].node.value > 1) {
        // asymptotically approach 1, starting at 0.9
        _value = 1 - (1 / activeNodes[index].node.value) * 0.1;
      }
    }
  
    // Colored bubble
    ctx.beginPath();
    var _circleRadiusGoto = r * _value!; // radius
    activeNodes[index].geometry.circleRadius = activeNodes[index].geometry.circleRadius * 0.8 + _circleRadiusGoto * 0.2;
    ctx.arc(0, 0, activeNodes[index].geometry.circleRadius, 0, MathCollection["tau"], false);
    ctx.fillStyle = color;
    ctx.fill();
  
    // Text!
    var fontsize = 25;
    ctx.font = "normal " + fontsize + "px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000";
    var width = ctx.measureText(activeNodes[index].node.label).width;
    while (width > r * 2 - 30) {
      // -30 for buffer. HACK: HARD-CODED.
      fontsize -= 1;
      ctx.font = "normal " + fontsize + "px sans-serif";
      width = ctx.measureText(activeNodes[index].node.label).width;
    }
    ctx.fillText(activeNodes[index].node.label, 0, 0);
  
    // WOBBLE CONTROLS
    var cl = 40;
    var cy = 0;
  
    // Controls!
    ctx.globalAlpha = activeNodes[index].geometry.controlsAlpha;
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    // top arrow
    ctx.beginPath();
    ctx.moveTo(-cl, -cy - cl);
    ctx.lineTo(0, -cy - cl * 2);
    ctx.lineTo(cl, -cy - cl);
    ctx.lineWidth = activeNodes[index].geometry.controlsDirection > 0 ? 10 : 3;
    ctx.stroke();
    // bottom arrow
    ctx.beginPath();
    ctx.moveTo(-cl, cy + cl);
    ctx.lineTo(0, cy + cl * 2);
    ctx.lineTo(cl, cy + cl);
    ctx.lineWidth = activeNodes[index].geometry.controlsDirection < 0 ? 10 : 3;
    ctx.stroke();
  
    // Restore
    ctx.restore();
  }

  function getNodeByPoint(point: Position): number {
    for(let i = 0; i < activeNodes.length; i++){
      if(IsPointInNode(point, activeNodes[i].node.pos, 50)){
        return activeNodes[i].node.id
      }
    }
    return -1
  }

  function updateNode(index: number, config: NodeConfiguration) {
    let nodeElems = activeNodes;
    nodeElems[index].config = config;
    nodeElems[index].node.label = config.label;
    nodeElems[index].node.value = config.startValue;
    activeNodes = nodeElems;
    setNodesChanged(!nodesChanged);
  }

  function searchNodeIndexById(id: number) {
    for(let i = 0; i < activeNodes.length; i++){
      if(activeNodes[i].node.id == id){
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
