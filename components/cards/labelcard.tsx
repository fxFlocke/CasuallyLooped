import { useContext } from "react";
import { AppContext } from "@/state/global";
import { NodeConfiguration } from "@/datatypes/commondatatypes";

export function LabelCard() {
  const [ appState, dispatch ] = useContext(AppContext);

  function evaluateInputValue(): string{
    if(appState.config.nodes.length >= appState.config.editingIndex && appState.config.editingIndex !== -1){
      return appState.config.nodes[appState.config.editingIndex - 1].config.label 
    }
    return ""
  }

  function changeLabel(newLabel: string){
    console.log("change label : ", newLabel, " of node: ", appState.config.editingIndex - 1)
    let nodes = appState.config.nodes
    nodes[appState.config.editingIndex - 1].config.label = newLabel
    dispatch({type:"CHANGE_LABEL", data: nodes})
  }

  return (
    <>
      <div className="grid grid-cols-1 w-[158px] h-[90px] overflow-hidden rounded-lg shadow-lg bg-[#2d4a64] normal-case">
        <div className="justify-start pt-[10px] pl-[15px] h-28">
          <label
            form="name"
            className="pr-[100px] block mb-2 text-sm font-light text-black dark:text-gray-300">
            Label
          </label>
          <input
            type="text"
            id="label"
            value={ evaluateInputValue() }
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              changeLabel(e.target.value)
            }}
            className="bg-gray-30 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-100 focus:border-blue-100 block w-[125px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-100 dark:focus:border-blue-100"
            required
          />
        </div>
      </div>
    </>
  );
}
