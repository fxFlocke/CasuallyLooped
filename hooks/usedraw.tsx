/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react";
import type { Position } from '@/datatypes/commondatatypes'
import { AppContext } from "@/state/global";
import { AdjustNodePositions, AdjustTextPositions } from "@/functionality/geometry";

export const useClickMove = (
  onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void
) => {
  const [appState, dispatch] = useContext(AppContext);

  const [mouseDown, setMouseDown] = useState(false);
  const [screenSize, setScreenSize] = useState<Position>({x: 1, y: 1})
  const [mouseMove, setMouseMove] = useState<Position>({x: 0, y: 0})
  const [mouseClick, setMouseClick] = useState<Position>({ x: 0, y: 0});
  const [windowClick, setWindowClick] = useState<Position>({ x: 0, y: 0})
  const [zoom, setZoom] = useState<ZoomEvent>({
    x: 0,
    y: 0,
    zoom: 1
  })

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<null | Point>(null);

  let zoomIntesity = 0.05

  const onMouseDown = () => setMouseDown(true);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // if(window){
    //   setScreenSize({x: window.screen.width, y: window.screen.width})
    // }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const currentPoint = computePointInCanvas(e);
      if (!mouseDown) {
        if(appState.config.actionMode === "simulate"){
          setMouseMove({x: currentPoint!.x, y: currentPoint!.y})
        }
        return
      };


      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !currentPoint) return;

      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
      prevPoint.current = currentPoint;
    };

    const computePointInCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    };

    const mouseUpHandler = () => {
      setMouseDown(false);
      prevPoint.current = null;
    };

    const mouseClickHandler = (e: MouseEvent) => {
      if (mouseDown === false) {
        const currentPoint = computePointInCanvas(e);
        setWindowClick({
          x: e.clientX,
          y: e.clientY
        })
        setMouseClick({
          x: currentPoint!.x / zoom.zoom,
          y: currentPoint!.y / zoom.zoom
        });
      }
    };

    const resizeHandler = () => {
      if(window.innerWidth === undefined || window.innerHeight === undefined) {
        return
      }
      let nodes = appState.config.nodes
      let texts = appState.config.texts
      dispatch({type: "EDIT", data: AdjustNodePositions(nodes, decideOldDimension(), {x: window.innerWidth, y: window.innerHeight})})
      dispatch({type: "EDIT_TEXTS", data: AdjustTextPositions(texts, decideOldDimension(), {x: window.innerWidth, y: window.innerHeight})})
      setScreenSize({x: window.innerWidth, y: window.innerHeight})
    }

    // Add event listeners
    canvasRef.current?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", mouseUpHandler);
    window.addEventListener("click", mouseClickHandler);
    window.addEventListener("resize", resizeHandler)
    // Remove event listeners
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      canvasRef.current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", mouseUpHandler);
      window.removeEventListener("click", mouseClickHandler);
      window.removeEventListener("resize", resizeHandler)
    };
  }, [onDraw]);

  function decideOldDimension(): Position{
    if(screenSize.x === 1 && screenSize.y === 1){
      return {x: window.innerWidth, y: window.innerHeight}
    } else {
      return screenSize
    }
  }

  return { canvasRef, onMouseDown, mouseClick, mouseMove, windowClick, clear, zoom };
};

export type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

export type ZoomEvent = {
  x: number,
  y: number,
  zoom: number
}

export type Point = { x: number; y: number };
