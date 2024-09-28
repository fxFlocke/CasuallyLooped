import { useContext } from "react";
import Image from "next/image";
import { AppContext } from "@/state/global";

export function ColorCard() {
  const [appState, dispatch] = useContext(AppContext);

  function detectColor(click: React.MouseEvent<HTMLElement>){
    const {left, top} = click.currentTarget.getBoundingClientRect()
    const imgPoint = click.clientX - left
    let nodes = appState.config.nodes
    if(imgPoint < 25 ){
      nodes[appState.config.editingIndex - 1].config.hue = 0
      dispatch({type:"CHANGE_COLOR", data: nodes})
      return
    }if(imgPoint < 50){
      nodes[appState.config.editingIndex - 1].config.hue = 1
      dispatch({type:"CHANGE_COLOR", data: nodes})
      return
    }if(imgPoint < 75){
      nodes[appState.config.editingIndex - 1].config.hue = 2
      dispatch({type:"CHANGE_COLOR", data: nodes})
      return
    }if(imgPoint < 100){
      nodes[appState.config.editingIndex - 1].config.hue = 3
      dispatch({type:"CHANGE_COLOR", data: nodes})
      return
    }if(imgPoint < 125){
      nodes[appState.config.editingIndex - 1].config.hue = 4
      dispatch({type:"CHANGE_COLOR", data: nodes})
      return
    }
    nodes[appState.config.editingIndex - 1].config.hue = 5
    dispatch({type:"CHANGE_COLOR", data: nodes})
  }
  
  return (
    <>
      <div className="grid grid-cols-1 w-[158px] h-[90px] overflow-hidden rounded-lg shadow-lg bg-[#2d4a64] normal-case">
        <div className="pt-[10px] pl-1 h-28">
          <label
            form="color"
            className="pr-1 pb-4 text-sm font-light text-black dark:text-gray-300">
            Color
          </label>
          <Image
            src="/sliders/color.png"
            alt="Profilbild"
            width={150}
            height={150}
            className="rounded-xl mt-2 w-auto h-auto"
            onClick={(event) => detectColor(event)}
          />
        </div>
      </div>
    </>
  );
}
