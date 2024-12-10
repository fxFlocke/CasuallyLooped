import { Configuration, NodeConfiguration } from "@/datatypes/commondatatypes";
import { LabelCard } from "../cards/labelcard";
import { ColorCard } from "../cards/colorcard";
import { ValueCard } from "../cards/valuecard";
import { SliderCard } from "../cards/slidercard";
import { EditingOption } from "../buttons/editingoption";
import { useContext, useState } from "react";
import { AppContext } from "@/state/global";

export function SimulationBar() {
  const [ appState, dispatch ] = useContext(AppContext);
  const [ previousSpeed, setPreviousSpeed] = useState("")

  function playPauseSimulation(){
    if(appState.config.simulationSpeed !== "0"){
      setPreviousSpeed(appState.config.simulationSpeed)
      dispatch({type:"EDIT_SPEED", data: "0"})
    }else{
      dispatch({type:"EDIT_SPEED", data: previousSpeed})
    }
  }

  return (
    <>
      <div className="flex">
        <div onClick={() => playPauseSimulation()} className="bg-white mx-6">
          <EditingOption iconPath="/icons/pause.png"/>
        </div>
        <div className="mr-6">
          <SliderCard/>
        </div>
      </div>
    </>
  );
}
