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

export function getCanvasStart() {
  //When responsive, getScreenSize & switch for different paddings
}