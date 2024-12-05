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
    if(appState.config.nodes === undefined) return
    if(appState.config.editingIndex === -1) return
    let nodes = appState.config.nodes
    nodes[appState.config.editingIndex - 1].config.label = newLabel
    dispatch({type:"EDIT", data: nodes})
  }

  return (
    <>
      <div className="grid grid-cols-1 w-[158px] h-[90px] overflow-hidden rounded-lg shadow-lg bg-[#2b2d2d] normal-case">
        <div className="justify-start pt-[10px] pl-[15px] h-28">
          <label
            form="name"
            className="pr-[100px] block mb-2 text-sm font-light text-black dark:text-gray-300">
            Label
          </label>
          <input
            className="bg-[#2b2d2d] border border-gray-100 text-sm rounded-lg focus:ring-gray-100 focus:border-gray-100 block w-[125px] p-2.5 text-gray-400"
            type="text"
            id="label"
            value={ evaluateInputValue() }
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              changeLabel(e.target.value)
            }}
            required
          />
        </div>
      </div>
    </>
  );
}
