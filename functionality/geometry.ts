import type { ArrowDrawBase, EdgeDrawBase, LabelDrawBase, Position, Bound, NodeElement, EdgeElement } from "@/datatypes/commondatatypes";
import { getEdgeByID, getEdgeIndexByID, getNodeByID, getNodeIndexByID } from "@/functionality/searcher";
import { Node } from "@/datatypes/commondatatypes";
import { MathCollection } from "@/datatypes/collections";
import { Point } from "@/hooks/usedraw";

export function IsPointInElement(pointPos: Position, elementPos: Position, r: number): boolean {
  // Point distance
  var dx = elementPos.x - pointPos.x;
  var dy = elementPos.y - pointPos.y;
  var dist2 = dx * dx + dy * dy;

  // My radius
  var r2 = r * r;

  // Inside?
  return dist2 <= r2;
}

export function IsPointInUpperHalf(pointPos: Position, elementPos: Position, r: number): number {
  let upperPos: Position = {
    x: elementPos.x,
    y: elementPos.y
  }
  upperPos.y -= 30
  if(IsPointInElement(pointPos, upperPos, r)){
    return 1
  }else if(IsPointInElement(pointPos, elementPos, r)){
    return -1
  }
  return 0
}

export function ScaleCanvasForDevicePixelRatio(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D | null) {
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx!.scale(dpr, dpr);
  }
}

export function GetPositionAlongArrow(value: number, begin: number, end: number, w: number, r: number, y: number, y2: number){
  var input = -0.05 + value * 1.1; // (0,1) --> (-0.05, 1.05)

  // If the arc's circle is actually BELOW the line...
  var begin2 = begin;
  if (y < 0) {
    // DON'T KNOW WHY THIS WORKS, BUT IT DOES.
    if (begin2 > 0) {
      begin2 -= MathCollection.tau;
    } else {
      begin2 += MathCollection.tau;
    }
  }

  // Get angle!
  var angle = begin2 + (end - begin2) * input;

  // return x & y
  return {
    x: w / 2 + Math.cos(angle) * r,
    y: y2 + Math.sin(angle) * r,
  };
}

//y2, startAngle, endarrowLength, labelX, labelY
export function EdgeCreationCalculation(startNode: Node, endNode: Node, arc: number, rotation: number, impact?: number): [EdgeDrawBase, LabelDrawBase, ArrowDrawBase] {
      let radius = 50
      if(arc == 0){
        arc = 0.1
      }
      // Mathy calculations: (all retina, btw)
      var fx = (startNode.pos.x) * 2;
      var fy = (startNode.pos.y) * 2;
      var tx = (endNode.pos.x) * 2;
      var ty = (endNode.pos.y + 8) * 2;
      if (startNode.id == endNode.id) {
        rotation *= MathCollection.tau / 360;
        tx += Math.cos(rotation);
        ty += Math.sin(rotation);
      }
      var dx = (tx - fx);
      var dy = (ty - fy);
      var w = Math.sqrt(dx * dx + dy * dy);
      var a = Math.atan2(dy, dx);
      var h = Math.abs(arc * 2);
  
      // From: http://www.mathopenref.com/arcradius.html
      var r = (h / 2) + ((w * w) / (8 * h))
      var y = r - h; // the circle's y-pos is radius - given height.
      var a2 = Math.acos((w / 2) / r); // angle from x axis, arc-cosine of half-width & radius
  
      // Arrow buffer...
      var arrowBuffer = 15;
      var arrowDistance = (radius + arrowBuffer) * 2;
      var arrowAngle = arrowDistance / r; // (distance/circumference)*TAU, close enough.
      var beginDistance = (radius + arrowBuffer) * 2;
      var beginAngle = beginDistance / r;
  
      // Arc it!
      var startAngle = a2 - MathCollection.tau / 2;
      var endAngle = -a2;
      var y2
      var begin
      var end
      if (h > r) {
        startAngle *= -1;
        endAngle *= -1;
      }
      if (arc > 0) {
        y2 = y;
        begin = startAngle + beginAngle;
        end = endAngle - arrowAngle;
      } else {
        y2 = -y;
        begin = -startAngle - beginAngle;
        end = -endAngle + arrowAngle;
      }

      // Arrow HEAD!
      var arrowLength = 10 * 2;
      var ax = w / 2 + Math.cos(end) * r;
      var ay = y2 + Math.sin(end) * r;
      var aa = end + MathCollection.tau / 4;
  
      var l0;
      // if (self.allowance == 1) {
      //   l0 = "(+)->";
      // } else if (self.allowance == -1) {
      //   l0 = "(-)->";
      // } else {
      //   l0 = "";
      // }
      if(impact === undefined){
        impact = 1;
      }
      var l;
      if (impact > 2) l = "+++";
      else if (impact == 2) l = "++";
      else if (impact == 1) l = "+";
      else if (impact == 0) l = "?";
      else if (impact == -3) l = "– – –"; // EM dash, not hyphen.
      else if (impact == -2) l = "– –";
      else l = "–";
  
      var labelPosition = GetPositionAlongArrow(0.5, begin, end, w, r, y, y2);
      var lx = labelPosition.x;
      var ly = labelPosition.y;
  
      // ACTUAL label position, for grabbing purposes
      var labelX = (fx + Math.cos(a) * lx - Math.sin(a) * ly) / 2; // un-retina
      var labelY = (fy + Math.sin(a) * lx + Math.cos(a) * ly) / 2; // un-retina
  
      // ...add offset to label
      var labelBuffer = 25 * 2; // retina
      if (arc < 0) labelBuffer *= -1;
      ly -= labelBuffer;

      let edgeDrawBase = {
        f: {
          x: fx,
          y: fy
        },
        ap: {
          x: ax,
          y: ay
        },
        a: a,
        aa: aa,
        w: w,
        y2: y2,
        r: r
      }
      let labelDrawBase = {
        lp: {
          x: lx,
          y: ly
        },
        l: l,
        labelXY: {
          x: labelX,
          y: labelY
        }
      }
      let arrowDrawBase = {
        startAngle: startAngle,
        end: end,
        arrowLength: arrowLength
      }
      return [edgeDrawBase, labelDrawBase, arrowDrawBase]
}

export function CalculateEdgeRotationAndArc(strokeData: Point[], startNode: Node, endNode: Node): [number, number]{
  let startPos = startNode.pos
  let endPos = endNode.pos
  let radius = 30

  var rotation: number
  var arc: number

  if (startNode.id === endNode.id){
    var bounds = getBound(strokeData);
    var x = (bounds.left + bounds.right) / 2;
    var y = (bounds.top + bounds.bottom) / 2;
    var dx = x - startPos.x;
    var dy = y - startPos.y;
    var angle = Math.atan2(dy, dx);

    // Then, find arc height.
    var translated = translatePoints(
      strokeData,
      -startPos.x,
      -startPos.y
    );
    var rotated = rotatePoints(translated, -angle);
    bounds = getBound(rotated);

    // Arc & Rotation!
    rotation = angle * (360 / MathCollection.tau) + 90;
    arc = bounds.right;


    var minimum = radius + 25;
    if (arc < minimum) arc = minimum;
  }else{
    // Otherwise, find the arc by translating & rotating
    var dx = endPos.x - startPos.x;
    var dy = endPos.y - startPos.y;
    var angle = Math.atan2(dy, dx);
    var translated = translatePoints(strokeData, (-startPos.x), (-startPos.y));
    let rotated = rotatePoints(translated, -angle)
    let bounds = getBound(rotated);

    rotation = 0

    if (Math.abs(bounds.top) > Math.abs(bounds.bottom))
      arc = -bounds.top;
    else arc = -bounds.bottom;

  }

  return [rotation, arc]
}

function getBound(points: Point[]): Bound{
  var left = Infinity,
  top = Infinity,
  right = -Infinity,
  bottom = -Infinity

  for (var i = 0; i < points.length; i++) {
    var point: Position = {
      x: points[i].x,
      y: points[i].y
    };
    if (point.x < left) left = point.x;
    if (right < point.x) right = point.x;
    if (point.y < top) top = point.y;
    if (bottom < point.y) bottom = point.y;
  }

  // Dimensions
  var width = right - left;
  var height = bottom - top;

  // Gimme
  let bound: Bound = {
    top: top,
    bottom: bottom,
    left: left,
    right: right,
    width: width,
    height: height,
  };
  return bound
}

function translatePoints(points: Point[], dx: number, dy: number): Point[]{
  var translatedPoints = points
  for (var i = 0; i < translatedPoints.length; i++) {
    translatedPoints[i].x += dx;
    translatedPoints[i].y += dy;
  }
  return translatedPoints
}

function rotatePoints(points: Point[], angle: number): Point[]{
  var rotatedPoints = points
  for (var i = 0; i < rotatedPoints.length; i++) {
    let x = rotatedPoints[i].x
    let y = rotatedPoints[i].y
    rotatedPoints[i].x = x * Math.cos(angle) - y * Math.sin(angle);
    rotatedPoints[i].y = y * Math.cos(angle) + x * Math.sin(angle);
  }
  return rotatedPoints
}

export function CascadeNodeDragToEdges(startNodeIndex: number, nodes: NodeElement[]): NodeElement[]{
  var transformedNodes = nodes
  let startNode = nodes[startNodeIndex]

  for(let i = 0; i < startNode.edges.length; i++){
    let edge = startNode.edges[i]
    let endNode = nodes[getNodeIndexByID(edge.edge.to, nodes)]
    let [newDrawBase, newLabelBase, newArrowBase] = EdgeCreationCalculation(startNode.node, endNode.node, edge.geometry.arc, edge.geometry.rotation, edge.edge.impact)
    edge.geometry.drawBase = newDrawBase
    edge.geometry.labelDrawBase = newLabelBase
    edge.geometry.arrowDrawBase = newArrowBase
    transformedNodes[startNodeIndex].edges[i] = edge
  }

  for(let i = 0; i < startNode.edgeReferences.length; i++){
    let nodeIndex = getNodeIndexByID(startNode.edgeReferences[i].node, nodes)
    let refStartNode = nodes[nodeIndex]
    let edgeIndex = getEdgeIndexByID(startNode.edgeReferences[i].edge, refStartNode.edges)
    let edge = refStartNode.edges[edgeIndex]
    let [newDrawBase, newLabelBase, newArrowBase] = EdgeCreationCalculation(refStartNode.node, startNode.node, edge.geometry.arc, edge.geometry.rotation, edge.edge.impact)
    edge.geometry.drawBase = newDrawBase
    edge.geometry.labelDrawBase = newLabelBase
    edge.geometry.arrowDrawBase = newArrowBase
    transformedNodes[nodeIndex].edges[edgeIndex] = edge
  }

  return transformedNodes
}

export function DragFromToEdge(edge: EdgeElement, from: Node, to: Node, labelX: number, labelY: number){
  // The Arc: whatever label *Y* is, relative to angle & first node's pos
  var fx = from.pos.x,
    fy = from.pos.y,
    tx = to.pos.x,
    ty = to.pos.y;
  var dx = tx - fx,
    dy = ty - fy;
  var a = Math.atan2(dy, dx)
  // Calculate arc
  var points: Point[] = [{x: labelX, y: labelY}];
  var translated = translatePoints(points, -fx, -fy);
  var rotated = rotatePoints(translated, -a);
  var newLabelPoint = rotated[0]
  // ooookay.
  let draggedEdge = edge
  console.log("arc before: ", draggedEdge.geometry.arc)
  console.log("arc after: ", -newLabelPoint.y)
  draggedEdge.geometry.arc = -newLabelPoint.y; // WHY NEGATIVE? I DON'T KNOW.
  let [drawBase, labelBase, arrowBase] = EdgeCreationCalculation(from, to, draggedEdge.geometry.arc, draggedEdge.geometry.rotation, draggedEdge.edge.impact)
  draggedEdge.geometry.drawBase = drawBase
  draggedEdge.geometry.labelDrawBase = labelBase
  draggedEdge.geometry.arrowDrawBase = arrowBase
  return draggedEdge
}

export function DragSelfToSelfEdge(edge: EdgeElement, from: Node, to: Node, labelX: number, labelY: number,){
  let radius = 50
  // For SELF-ARROWS: just get angle & mag for label.
  var dx = labelX - from.pos.x,
  dy = labelY - from.pos.y;
  var a = Math.atan2(dy, dx);
  var mag = Math.sqrt(dx * dx + dy * dy)
  // Minimum mag
  var minimum = radius + 25
  if (mag < minimum) mag = minimum
  // Update edge
  let draggedEdge = edge
  draggedEdge.geometry.arc = mag;
  draggedEdge.geometry.rotation = a * (360 / MathCollection["tau"]) + 90;
  let [drawBase, labelBase, arrowBase] = EdgeCreationCalculation(from, to, draggedEdge.geometry.arc, draggedEdge.geometry.rotation, draggedEdge.edge.impact)
  draggedEdge.geometry.drawBase = drawBase
  draggedEdge.geometry.labelDrawBase = labelBase
  draggedEdge.geometry.arrowDrawBase = arrowBase
  return draggedEdge
}

export function ScaleElements(scale: number, nodes: NodeElement[]): NodeElement[]{
  for(let i = 0; i < nodes.length; i++){
    let node = nodes[i]
    node.node.pos.x *= scale
    node.node.pos.y *= scale
    node.config.radius *= scale
    nodes[i] = node
  }

  // for(let i = 0; i < nodes.length; i++){
  //   let node = nodes[i]
  //   for(let j = 0; j < node.edges.length; j++){
  //     let edge = node.edges[j]
  //     let toNodeIndex = getNodeIndexByID(edge.edge.to, nodes)
  //     let [newDrawBase, newLabelBase, newArrowBase] = EdgeCreationCalculation(node.node, nodes[toNodeIndex].node, edge.geometry.arc, edge.geometry.rotation, edge.edge.impact)
  //     edge.geometry.drawBase = newDrawBase
  //     edge.geometry.labelDrawBase = newLabelBase
  //     edge.geometry.arrowDrawBase = newArrowBase
  //     node.edges[j] = edge
  //   }
  //   nodes[i] = node
  // }

  return nodes
}