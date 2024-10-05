import { NodeElement } from "@/datatypes/commondatatypes";
import { ColorCollection, MathCollection } from "@/datatypes/collections";
import { DrawText } from "./drawText";

export function DrawNode(ctx: CanvasRenderingContext2D, node: NodeElement, editingIndex: number, editMode: string) {
    var x = Math.round(node.node.pos.x) //.pos.x;
    var y = Math.round(node.node.pos.y);
    var r = Math.round(node.config.radius); //replace later
    var color = ColorCollection[node.config.hue];

    // Translate!
    ctx.save();
    ctx.translate(x, y);
  
    // Synchronize & Visualize Editing
    if (editingIndex == node.node.id && editMode === "node") {
      //Draw Highlight
      ctx.beginPath();
      ctx.arc(0, 0, r + 20, 0, MathCollection["tau"], false);
      ctx.fillStyle = ColorCollection[6];
      ctx.fill();
      //Take label
      
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
    var _r = Math.atan(node.config.startValue * 5);
    _r = _r / (Math.PI / 2);
    _r = (_r + 1) / 2;
  
    // INFINITE RANGE FOR RADIUS
    // linear from 0 to 1, asymptotic otherwise.
    var _value = 4;
    if (node.config.startValue >= 0 && node.config.startValue <= 1) {
      // (0,1) -> (0.1, 0.9)
      _value = 0.1 + 0.8 * node.config.startValue;
    } else {
      if (node.node.value < 0) {
        // asymptotically approach 0, starting at 0.1
        _value = (1 / (Math.abs(node.config.startValue) + 1)) * 0.1;
      }
      if (node.config.startValue > 1) {
        // asymptotically approach 1, starting at 0.9
        _value = 1 - (1 / node.config.startValue) * 0.1;
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
    }

    // Text!
    DrawText(ctx, node.config.label, r)
  
    // WOBBLE CONTROLS
    var cl = 40;
    var cy = 0;
  
    // Controls!
    ctx.globalAlpha = node.geometry.controlsAlpha;
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    // top arrow
    ctx.beginPath();
    ctx.moveTo(-cl, -cy - cl);
    ctx.lineTo(0, -cy - cl * 2);
    ctx.lineTo(cl, -cy - cl);
    ctx.lineWidth = node.geometry.controlsDirection > 0 ? 10 : 3;
    ctx.stroke();
    // bottom arrow
    ctx.beginPath();
    ctx.moveTo(-cl, cy + cl);
    ctx.lineTo(0, cy + cl * 2);
    ctx.lineTo(cl, cy + cl);
    ctx.lineWidth = node.geometry.controlsDirection < 0 ? 10 : 3;
    ctx.stroke();
  
    // Restore
    ctx.restore();
}