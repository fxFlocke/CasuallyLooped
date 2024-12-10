import { Edge, EdgeGeometry, NodeElement, Signal } from "@/datatypes/commondatatypes";
import { GetPositionAlongArrow } from "../geometry";
import { getNodeByID } from "../searcher";
import { ColorCollection } from "@/datatypes/collections";

export function DrawSignal(ctx: CanvasRenderingContext2D, signal: Signal, edge: EdgeGeometry, nodes: NodeElement[]) {

    let position = signal.position
    let begin = edge.arrowDrawBase.begin
    let end = edge.arrowDrawBase.end
    let w = (edge.drawBase.w)
    let r = (edge.drawBase.r)
    let y = edge.drawBase.y
    let y2 = edge.drawBase.y2
    var signalPosition = GetPositionAlongArrow(position, begin, end, w, r, y, y2);

    var signalX = signalPosition.x;
    var signalY = signalPosition.y;

    // Transform
    ctx.save();
    ctx.translate(signalX / 2, signalY / 2);
    ctx.rotate(-edge.drawBase.a);

    // Signal's direction & size
    var size = 20; // HARD-CODED
    ctx.scale(signal.scale, 0.33);
    ctx.scale(size, size);

    // Signal's COLOR, BLENDING
    let fromNode = getNodeByID(edge.from, nodes)
    let toNode = getNodeByID(edge.to, nodes)
    var fromColor = fromNode!.config.hue;
    var toColor = toNode!.config.hue;
    var blend;
    var bStart = 0.4,
      bEnd = 0.6;
    if (signal.position < bStart) {
      blend = 0;
    } else if (signal.position < bEnd) {
      blend = (signal.position - bStart) / (bEnd - bStart);
    } else {
      blend = 1;
    }
    var signalColor = blendColors(ColorCollection[fromColor], ColorCollection[toColor], blend);

    // Also, tween the scaleY, flipping, IF STRENGTH<0
    if (signal.identifiers.strength < 0) {
      // sin/cos-animate it for niceness.
      var flip = Math.cos(blend * Math.PI); // (0,1) -> (1,-1)
      ctx.scale(1, flip);
    }

    // Draw an arrow
    ctx.beginPath();
    ctx.moveTo(-2, 0);
    ctx.lineTo(0, -2);
    ctx.lineTo(2, 0);
    ctx.lineTo(1, 0);
    ctx.lineTo(1, 2);
    ctx.lineTo(-1, 2);
    ctx.lineTo(-1, 0);
    ctx.fillStyle = signalColor;
    ctx.fill();

    // Restore
    ctx.restore();
}

function blendColors(color1: string, color2: string, blend: number){
    var color = "#";
    for (var i = 0; i < 3; i++) {
      // Into numbers...
      var sub1 = color1.substring(1 + 2 * i, 3 + 2 * i);
      var sub2 = color2.substring(1 + 2 * i, 3 + 2 * i);
      var num1 = parseInt(sub1, 16);
      var num2 = parseInt(sub2, 16);
  
      // Blended number & sub
      var num = Math.floor(num1 * (1 - blend) + num2 * blend);
      var sub = num.toString(16).toUpperCase();
      var paddedSub = ("0" + sub).slice(-2); // in case it's only one digit long
  
      // Add that babe
      color += paddedSub;
    }
  
    return color;
}