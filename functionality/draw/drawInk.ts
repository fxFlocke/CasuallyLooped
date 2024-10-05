import { Point } from "@/hooks/usedraw";

export function DrawInk(ctx: any, startPoint: Point, currX: number, currY: number, lineColor: string){
    const lineWidth = 5;

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
  }