import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { AppContext } from "@/state/global";

export function ColorCard() {
  const [appState, dispatch] = useContext(AppContext);
  const [colorPosition, setColorPosition] = useState("mt-1 ml-1")

  function detectInitialColor(){
    if(appState.config.editingIndex === -1) {
      setColorPosition("mt-1 ml-1")
      return
    }
    let color = appState.config.nodes[appState.config.editingIndex - 1].config.hue
    switch(color){
      case 0:
        setColorPosition("mt-1 ml-1")
        break
      case 1:
        setColorPosition("mt-1 ml-7.5")
        break
      case 2:
        setColorPosition("mt-1 ml-14")
        break
      case 3:
        setColorPosition("mt-1 ml-21")
        break
      case 4:
        setColorPosition("mt-1 ml-26")
        break
      case 5:
        setColorPosition("mt-1 ml-33")
        break
      default:
        setColorPosition("mt-1 ml-1")
    }
  }

  function detectClickedColor(click: React.MouseEvent<HTMLElement>){
    if(appState.config.editingIndex === -1){
      return
    }
    const {left, top} = click.currentTarget.getBoundingClientRect()
    const imgPoint = click.clientX - left
    let nodes = appState.config.nodes
    if(imgPoint < 25 ){
      nodes[appState.config.editingIndex - 1].config.hue = 0
      setColorPosition("mt-1 ml-1")
    }else if(imgPoint < 50){
      nodes[appState.config.editingIndex - 1].config.hue = 1
      setColorPosition("mt-1 ml-7.5")
    }else if(imgPoint < 75){
      nodes[appState.config.editingIndex - 1].config.hue = 2
      setColorPosition("mt-1 ml-14")
    }else if(imgPoint < 100){
      nodes[appState.config.editingIndex - 1].config.hue = 3
      setColorPosition("mt-1 ml-21")
    }else if(imgPoint < 125){
      nodes[appState.config.editingIndex - 1].config.hue = 4
      setColorPosition("mt-1 ml-26")
    }else{
      nodes[appState.config.editingIndex - 1].config.hue = 5
      setColorPosition("mt-1 ml-33")
    }
    dispatch({type:"CHANGE_NODE", data: nodes})
  }

  useEffect(() => {
    detectInitialColor()
  }, [appState])
  
  return (
    <>
      <div className="grid grid-cols-1 w-[158px] h-[90px] overflow-hidden rounded-lg shadow-lg bg-[#2b2d2d] normal-case">
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
            className="rounded-xl mt-2 w-auto h-auto cursor-pointer"
            onClick={(event) => detectClickedColor(event)}
          />
          <Image
          src="/icons/upArrowWhite.png"
          alt="upArrow"
          width={15}
          height={15}
          className={colorPosition}/>
        </div>
      </div>
    </>
  );
}
