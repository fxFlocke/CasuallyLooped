import { ColorCollection, MathCollection } from "@/datatypes/collections";
import { Node, NodeConfiguration } from "@/datatypes/commondatatypes";
import { RefObject, useEffect, useState } from "react";

export function NodeComponent({
  node,
  config,
  canvasRef,
  editingIndex,
}: {
  node: Node;
  config: NodeConfiguration;
  canvasRef: RefObject<HTMLCanvasElement>;
  editingIndex: number;
}) {
  const [circleRadius, setCircleRadius] = useState(0);
  const [controlsAlpha, setControlsAlpha] = useState(0);
  const [controlsDirection, setControlsDirection] = useState(0);

  return (
    <>
        <a>{node.id}</a>
    </>
  );
}