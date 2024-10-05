import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { AppContext } from "@/state/global";

export function ValueCard() {
  const [appState, dispatch] = useContext(AppContext);
  const [impactPosition, setImpactPosition] = useState("mt-1 ml-1")

  function detectInitialValue(){
    if(appState.config.editingIndex === -1) {
      setImpactPosition("mt-1 ml-1")
      return
    }
    let value = appState.config.nodes[appState.config.editingIndex - 1].config.startValue
    switch(value){
      case 0:
        setImpactPosition("mt-1 ml-1")
        break
      case 0.16:
        setImpactPosition("mt-1 ml-6.5")
        break
      case 0.33:
        setImpactPosition("mt-1 ml-12")
        break
      case 0.55:
        setImpactPosition("mt-1 ml-18")
        break
      case 0.67:
        setImpactPosition("mt-1 ml-23")
        break
      case 0.83:
        setImpactPosition("mt-1 ml-28")
        break
      case 1:
        setImpactPosition("mt-1 ml-34")
        break
      default: 
        setImpactPosition("mt-1 ml-1")
    }
  }

  function detectValue(click: React.MouseEvent<HTMLElement>){
    if(appState.config.editingIndex === -1){
      return
    }
    const {left, top} = click.currentTarget.getBoundingClientRect()
    const valuePoint = click.clientX - left
    let nodes = appState.config.nodes
    if(valuePoint < 21.2 ){
      nodes[appState.config.editingIndex - 1].config.startValue = 0
      setImpactPosition("mt-1 ml-1")
    }else if(valuePoint < 43){
      nodes[appState.config.editingIndex - 1].config.startValue = 0.16
      setImpactPosition("mt-1 ml-6.5")
    }else if(valuePoint < 64.5){
      nodes[appState.config.editingIndex - 1].config.startValue = 0.33
      setImpactPosition("mt-1 ml-12")
    }else if(valuePoint < 86){
      nodes[appState.config.editingIndex - 1].config.startValue = 0.55
      setImpactPosition("mt-1 ml-18")
    }else if(valuePoint < 107.5){
      nodes[appState.config.editingIndex - 1].config.startValue = 0.67
      setImpactPosition("mt-1 ml-23")
    }else if(valuePoint < 129){
      nodes[appState.config.editingIndex - 1].config.startValue = 0.83
      setImpactPosition("mt-1 ml-28")
    }else{
      nodes[appState.config.editingIndex - 1].config.startValue = 1
      setImpactPosition("mt-1 ml-34")
    }
    dispatch({type:"CHANGE_NODE", data: nodes})
  }

  useEffect(() => {
    detectInitialValue()
  }, [appState])

  return (
    <>
      <div className="grid grid-cols-1 w-[158px] h-[90px] overflow-hidden rounded-lg shadow-lg bg-[#2b2d2d] normal-case">
        <div className="pt-[10px] pl-1 h-28">
          <label
            form="impact"
            className="pr-1 pb-4 text-sm font-light text-black dark:text-gray-300"
          >
            Impact
          </label>
          <Image
            src="/sliders/initial.png"
            alt="Profilbild"
            width={150}
            height={150}
            className="rounded-xl mt-2 w-auto h-auto cursor-pointer"
            onClick={(event) => detectValue(event)}
          />
          <Image
          src="/icons/upArrowWhite.png"
          alt="upArrow"
          width={15}
          height={15}
          className={impactPosition}/>
        </div>
      </div>
    </>
  );
}
