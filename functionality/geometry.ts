import type { ArrowDrawBase, EdgeDrawBase, LabelDrawBase, Position, Bound } from "@/datatypes/commondatatypes";
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
export function EdgeCreationCalculation(startNode: Node, endNode: Node, arc: number, rotation: number): [EdgeDrawBase, LabelDrawBase, ArrowDrawBase] {
      let radius = 50
      if(arc == 0){
        arc = 0.1
      }
      // Mathy calculations: (all retina, btw)
      var fx = (startNode.pos.x) * 2;
      var fy = (startNode.pos.y) * 2;
      var tx = (endNode.pos.x) * 2;
      var ty = (endNode.pos.y) * 2;
      if (startNode.id == endNode.id) {
        rotation *= MathCollection.tau / 360;
        tx += Math.cos(rotation);
        ty += Math.sin(rotation);
      }
      var dx = tx - fx;
      var dy = ty - fy;
      var w = Math.sqrt(dx * dx + dy * dy);
      var a = Math.atan2(dy, dx);
      var h = Math.abs(arc * 2);
  
      // From: http://www.mathopenref.com/arcradius.html
      var r = h / 2 + (w * w) / (8 * h);
      var y = r - h; // the circle's y-pos is radius - given height.
      var a2 = Math.acos(w / 2 / r); // angle from x axis, arc-cosine of half-width & radius
  
      // Arrow buffer...
      var arrowBuffer = 15;
      var arrowDistance = (radius + arrowBuffer) * 2;
      var arrowAngle = arrowDistance / r; // (distance/circumference)*TAU, close enough.
      var beginDistance = (radius + arrowBuffer)// * 2;
      var beginAngle = beginDistance / r;
  
      // Arc it!
      var startAngle = a2 - MathCollection.tau / 2;
      var endAngle = -a2;
      var y2
      var begin
      var end
      if (h > r) {
        // console.log(" h smaller r")
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
      var impact = 1;
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
      var labelX = (fx + Math.cos(a) * lx - Math.sin(a) * ly) / 10000; // un-retina
      var labelY = (fy + Math.sin(a) * lx + Math.cos(a) * ly) / 10000; // un-retina
  
      // ...add offset to label
      var labelBuffer = 18 * 2; // retina
      if (arc < 0) labelBuffer *= -1;
      ly += labelBuffer;

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
  let radius = 50

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
    var translated = translatePoints(strokeData, -startPos.x, -startPos.y);
    var rotated = rotatePoints(translated, -angle);
    let bounds = getBound(rotated);

    rotation = 0//(360 / MathCollection.tau) + 90

    // Arc!
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
    var point = points[i];
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
    rotatedPoints[i].x = rotatedPoints[i].x * Math.cos(angle) - rotatedPoints[i].y * Math.sin(angle);
    rotatedPoints[i].y = rotatedPoints[i].y * Math.cos(angle) + rotatedPoints[i].x * Math.sin(angle);
  }
  return rotatedPoints
}

export function Decide3DxOffset(pos: Position){
  if(pos.x <= 600 && pos.y <= 400){
    return (-5.8)
  }
  if(pos.x > 600 && pos.y <= 400){
    return 5.8
  }
  if(pos.x <= 600 && pos.y > 400){
    return (-5.8)
  }
  return 5.8
}

export function DecideYPosition(pos: Position, yBase: number){
  if(pos.y <= 400){
    return (3.8 - yBase)
  }
  return (3.8 - (yBase))
}
