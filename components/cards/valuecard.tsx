import { useContext } from "react";
import Image from "next/image";
import { AppContext } from "@/state/global";

export function ValueCard() {
  const [appState, dispatch] = useContext(AppContext);

  function detectValue(click: React.MouseEvent<HTMLElement>){
    const {left, top} = click.currentTarget.getBoundingClientRect()
    const valuePoint = click.clientX - left
    let nodes = appState.config.nodes
    if(valuePoint < 21.2 ){
      nodes[appState.config.editingIndex - 1].config.startValue = 0
    }else if(valuePoint < 43){
      nodes[appState.config.editingIndex - 1].config.startValue = 0.16
    }else if(valuePoint < 64.5){
      nodes[appState.config.editingIndex - 1].config.startValue = 0.33
    }else if(valuePoint < 86){
      nodes[appState.config.editingIndex - 1].config.startValue = 0.55
    }else if(valuePoint < 107.5){
      nodes[appState.config.editingIndex - 1].config.startValue = 0.67
    }else if(valuePoint < 129){
      nodes[appState.config.editingIndex - 1].config.startValue = 0.83
    }else{
      nodes[appState.config.editingIndex - 1].config.startValue = 1
    }
    dispatch({type:"CHANGE_NODE", data: nodes})
  }

  return (
    <>
      <div className="grid grid-cols-1 w-[158px] h-[90px] overflow-hidden rounded-lg shadow-lg bg-[#2d4a64] normal-case">
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
            className="rounded-xl mt-2 w-auto h-auto"
            onClick={(event) => detectValue(event)}
          />
        </div>
      </div>
    </>
  );
}
