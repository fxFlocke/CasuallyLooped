import { ColorCollection } from "@/datatypes/collections";
import { Position } from "@/datatypes/commondatatypes";

export function DrawText(ctx: CanvasRenderingContext2D, label: string, r: number) {
  var fontsize = 16;
  ctx.font = "bold " + fontsize + "px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  var width = ctx.measureText(label).width;
  while (width > r * 2 - 30) {
    // -30 for buffer. HACK: HARD-CODED.
    fontsize -= 1;
    ctx.font = "normal " + fontsize + "px sans-serif";
    width = ctx.measureText(label).width;
  }
  ctx.fillText(label, 0, 50);
}

export function DrawNote(ctx: CanvasRenderingContext2D, note: string, x: number, y: number, edit: boolean){

  var bounds = getBounds(ctx, note, {x: x + 50, y: y + 15});
	if(edit){
		ctx.save();
		ctx.beginPath();
		ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, 5);
		ctx.fillStyle = ColorCollection[6];
		ctx.fill();
		ctx.restore();
	}
  
  ctx.restore();

	// Translate!
	ctx.save();
	ctx.translate(x,y);

	// Text!
	ctx.font = "100 "+ 16 + "px sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#fff";

	// ugh new lines are a PAIN.
	var lines = breakText(note);
	ctx.translate(0, -(16*lines.length)/2);
	for(var i=0; i<lines.length; i++){
		var line = lines[i];
		ctx.fillText(line, 50, 20);
		ctx.translate(0, 16);
	}

	// Restore
	ctx.restore();
}

function breakText(text: string): string[] {
  return text.split(/\n/);
}

function getBounds(ctx: CanvasRenderingContext2D, text: string, pos: Position){
  // Get MAX width...
  var lines = breakText(text);
  var maxWidth = 0;
  for(var i=0; i<lines.length; i++){
    var line = lines[i];
    var w = (ctx.measureText(line).width + 10)*2;
    if(maxWidth<w) maxWidth=w;
  }

  // Dimensions, then:
  var w = maxWidth;
  var h = (16*lines.length);

  // Bounds, then:
  return {
    x: pos.x-w/2,
    y: pos.y-h/2-16/2,
    width: w,
    height: h+16/2
  };
}