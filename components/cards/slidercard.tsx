import { useContext } from "react";
import { AppContext } from "@/state/global";
import { NodeConfiguration } from "@/datatypes/commondatatypes";
import Image from "next/image";

export function SliderCard() {
  const [ appState, dispatch ] = useContext(AppContext);

  function evaluateInputValue(): string{
    return appState.config.simulationSpeed
  }

  function changeSpeed(newSpeed: string){
    dispatch({type:"EDIT_SPEED", data: newSpeed})
  }

  return (
    <>
      <div className="flex justify-around w-[500px] h-[50px] overflow-hidden rounded-lg shadow-lg bg-[#2b2d2d] normal-case place-items-center place-content-center">
        <Image src={"/icons/turtle.png"} alt="turtle" width={30} height={30} className="rounded-2xl cursor-pointer"/>
          <input
            className=" w-8/12"
            id="label"
            type="range"
            min="0" max="100" step="10"
            value={ evaluateInputValue() }
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              changeSpeed(e.target.value)
            }}
            required
          />
        <Image src={"/icons/rabbit.png"} alt="turtle" width={30} height={30} className="rounded-2xl cursor-pointer"/>
      </div>
    </>
  );
}
