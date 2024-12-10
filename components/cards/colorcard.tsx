import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { AppContext } from "@/state/global";
import { getNodeIndexByID } from "@/functionality/searcher";

export function ColorCard() {
  const [appState, dispatch] = useContext(AppContext);
  const [colorPosition, setColorPosition] = useState("mt-1 ml-1")

  function detectInitialColor(){
    if(appState.config.editingIndex === -1) {
      setColorPosition("mt-1 ml-1")
      return
    }
    let node = appState.config.nodes[getNodeIndexByID(appState.config.editingIndex, appState.config.nodes)]
    let color = node.config.hue
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
    let nodeIndex = getNodeIndexByID(appState.config.editingIndex, nodes)
    if(imgPoint < 25 ){
      nodes[nodeIndex].config.hue = 0
      setColorPosition("mt-1 ml-1")
    }else if(imgPoint < 50){
      nodes[nodeIndex].config.hue = 1
      setColorPosition("mt-1 ml-7.5")
    }else if(imgPoint < 75){
      nodes[nodeIndex].config.hue = 2
      setColorPosition("mt-1 ml-14")
    }else if(imgPoint < 100){
      nodes[nodeIndex].config.hue = 3
      setColorPosition("mt-1 ml-21")
    }else if(imgPoint < 125){
      nodes[nodeIndex].config.hue = 4
      setColorPosition("mt-1 ml-26")
    }else{
      nodes[nodeIndex].config.hue = 5
      setColorPosition("mt-1 ml-33")
    }
    dispatch({type:"EDIT", data: nodes})
  }

  useEffect(() => {
    detectInitialColor()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState])
  
  return (
    <>
      <div className="grid grid-cols-1 w-[158px] h-[90px] overflow-hidden rounded-lg shadow-lg bg-[#2b2d2d] normal-case">
        <div className="pt-[10px] pl-1 h-28">
          <label
            form="color"
            className="pr-1 pb-4 text-sm font-light text-white dark:text-gray-300">
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
