export function DrawText(ctx: CanvasRenderingContext2D, label: string, r: number) {
    var fontsize = 25;
    ctx.font = "normal " + fontsize + "px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#1c1d1d";
    var width = ctx.measureText(label).width;
    while (width > r * 2 - 30) {
      // -30 for buffer. HACK: HARD-CODED.
      fontsize -= 1;
      ctx.font = "normal " + fontsize + "px sans-serif";
      width = ctx.measureText(label).width;
    }
    ctx.fillText(label, 0, 0);
  }