import { ColorCollection, MathCollection } from "@/datatypes/collections";
import { EdgeElement, NodeElement, Position, Signal } from "@/datatypes/commondatatypes";
import { getEdgeIndexByID, getNodeByID } from "../searcher";
import { DrawSignal } from "./drawSignal";

export function DrawEdge(ctx: CanvasRenderingContext2D, edge: EdgeElement, editingIndex: number, editMode: string, signals?: Signal[], nodes?: NodeElement[]){
    if (edge.geometry.arc == 0) edge.geometry.arc = 0.1;

    // Width & Color
    ctx.lineWidth = 4 * Math.abs(edge.config.strength) - 2;
    ctx.strokeStyle = "#555";

    ctx.save();
    ctx.translate((edge.geometry.drawBase.f.x / 2), (edge.geometry.drawBase.f.y / 2));
    ctx.rotate(edge.geometry.drawBase.a);

    if (edge.edge.id === editingIndex && editMode === "edge") {
      ctx.save();
      ctx.translate((edge.geometry.labelDrawBase.lp.x / 2), (edge.geometry.labelDrawBase.lp.y / 2));
      ctx.rotate(-edge.geometry.drawBase.a);
      ctx.beginPath();
      ctx.arc(0, 5, 30, 0, MathCollection["tau"], false);
      ctx.fillStyle = ColorCollection[6];
      ctx.fill();
      ctx.restore();
    }

    // Arc it!
    ctx.beginPath();
    if (edge.geometry.arc > 0) {
      ctx.arc(((edge.geometry.drawBase.w / 2) / 2), (edge.geometry.drawBase.y2 / 2), (edge.geometry.drawBase.r / 2), edge.geometry.arrowDrawBase.startAngle, edge.geometry.arrowDrawBase.end, false);
    } else {
      ctx.arc(((edge.geometry.drawBase.w / 2) / 2), (edge.geometry.drawBase.y2 / 2), (edge.geometry.drawBase.r / 2), -edge.geometry.arrowDrawBase.startAngle, edge.geometry.arrowDrawBase.end, true);
    }
    // Arrow HEAD!
    ctx.save();
    ctx.translate((edge.geometry.drawBase.ap.x / 2), (edge.geometry.drawBase.ap.y / 2));
    if (edge.geometry.arc < 0) ctx.scale(-1, -1);
    ctx.rotate(edge.geometry.drawBase.aa);
    ctx.moveTo(-edge.geometry.arrowDrawBase.arrowLength, -edge.geometry.arrowDrawBase.arrowLength);
    ctx.lineTo(0, 0);
    ctx.lineTo(-edge.geometry.arrowDrawBase.arrowLength, edge.geometry.arrowDrawBase.arrowLength);
    ctx.restore();

    // Stroke!
    ctx.stroke();

    // Draw label
    ctx.font = "100 32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.save();
    ctx.translate((edge.geometry.labelDrawBase.lp.x / 2), (edge.geometry.labelDrawBase.lp.y / 2));
    ctx.rotate(-edge.geometry.drawBase.a);
    ctx.fillStyle = "#fff";
    ctx.fillText(edge.geometry.labelDrawBase.l, 1, 1);

    ctx.restore();

    if(signals!== undefined && nodes !== undefined){
      for(let i = 0; i < signals.length; i++){
        if(signals[i].identifiers.edgeID === edge.edge.id){
          let node = getNodeByID(signals[i].identifiers.nodeID, nodes)
          let edgeIndex = getEdgeIndexByID(signals[i].identifiers.edgeID, node!.edges)
          DrawSignal(ctx, signals[i], node!.edges[edgeIndex].geometry, nodes)
          // ctx.restore()
        }
      }
    }

    ctx.restore()
  }