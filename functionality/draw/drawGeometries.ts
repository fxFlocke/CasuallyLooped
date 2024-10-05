import { NodeElement } from "@/datatypes/commondatatypes";
import { RefObject } from "react";
import { DrawNode } from "./drawNode";
import { DrawEdge } from "./drawEdge";

export function DrawGeometries(canvasRef: RefObject<HTMLCanvasElement>, editingIndex: number, editMode: string, clear: () => void, nodes?: NodeElement[]){
    if(nodes === undefined){
      return
    }
    let ctx = canvasRef.current?.getContext("2d")
    if (ctx === undefined || ctx == null){
      return
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    clear()
    for (let i = 0; i < nodes.length; i++){
      DrawNode(ctx, nodes[i], editingIndex, editMode)
    }
    for (let i = 0; i < nodes.length; i++){
      for (let j = 0; j < nodes[i].edges.length; j++){
        DrawEdge(ctx, nodes[i].edges[j], editingIndex, editMode)
      }
    }
  }