import { useContext } from "react";
import { AppContext } from "@/state/global";
import { NodeConfiguration } from "@/datatypes/commondatatypes";

export function TextCard() {
  const [ appState, dispatch ] = useContext(AppContext);

  function evaluateInputValue(): string{
    if(appState.config.editMode === "text" && appState.config.editingIndex !== -1){
      return appState.config.texts[appState.config.editingIndex].text
    }
    return ""
  }

  function changeLabel(newLabel: string){
    if(appState.config.texts === undefined) return
    if(appState.config.editingIndex === -1) return
    let texts = appState.config.texts
    texts[appState.config.editingIndex].text = newLabel
    dispatch({type:"EDIT_TEXTS", data: texts})
  }

  return (
    <>
      <div className="grid grid-cols-1 w-[500px] h-[90px] overflow-hidden rounded-lg shadow-lg bg-[#2b2d2d] normal-case">
        <div className="pt-[10px] h-28">
          <textarea
            className="bg-[#2b2d2d] border ml-3 border-gray-100 text-sm rounded-lg focus:ring-gray-100 focus:border-gray-100 block w-[475px] p-2.5 text-gray-400"
            id="label"
            value={ evaluateInputValue() }
            onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              changeLabel(e.target.value)
            }}
            required
          />
        </div>
      </div>
    </>
  );
}
