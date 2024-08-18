import { Position } from "@/datatypes/commondatatypes";
import { Node, NodeGeometry, NodeConfiguration } from "@/datatypes/commondatatypes";
import { RefObject } from "react";
import { ColorCollection, MathCollection } from "@/datatypes/collections";

export function IsPointInNode(pointPos: Position, nodePos: Position, r: number): boolean {
  // Point distance
  var dx = nodePos.x - pointPos.x;
  var dy = nodePos.y - pointPos.y;
  var dist2 = dx * dx + dy * dy;

  // My radius
  var r2 = r * r;

  // Inside?
  return dist2 <= r2;
}

export function DrawText(ctx: CanvasRenderingContext2D, label: string, r: number) {
  var fontsize = 25;
  ctx.font = "normal " + fontsize + "px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000";
  var width = ctx.measureText(label).width;
  while (width > r * 2 - 30) {
    // -30 for buffer. HACK: HARD-CODED.
    fontsize -= 1;
    ctx.font = "normal " + fontsize + "px sans-serif";
    width = ctx.measureText(label).width;
  }
  ctx.fillText(label, 0, 0);
}