import { useContext } from "react";
import { EditingOption, EditingOptionSmallerImage } from "../buttons/editingoption";
import { Logo } from "../buttons/logo";
import { AppContext } from "@/state/global";

export function EditingChoiceBar() {
  const [appState, dispatch] = useContext(AppContext);

  function setActionMode(data: string){
    dispatch({type:"CHANGE_EDITING_INDEX", data: -1});
    dispatch({type:"CHANGE_EDGE_EDITING_INDEX", data: -1});
    dispatch({type:"CHANGE_ACTION_MODE", data: data});
  }

  function setEditMode(data: string){
    dispatch({type:"CHANGE_EDITING_INDEX", data: -1});
    dispatch({type:"CHANGE_EDGE_EDITING_INDEX", data: -1});
    dispatch({type:"CHANGE_EDIT_MODE", data: data});
  }

  return (
    <>
      <div>
        <div className="flex flex-shrink md:pl-5 gap-x-2 md:gap-2">
          <div
            onClick={() => setEditMode("")}
            className="cursor-pointer">
            <Logo/>
          </div>
          <div className="flex flex-shrink pl-4 gap-6">
            <div onClick={() => {
              setActionMode("ink")
              setEditMode("node")
            }}>
              <EditingOption iconPath="/icons/whitePencil.png" />
            </div>
            <div onClick={() => {
              setActionMode("text")
              setEditMode("text")
            }}>
              <EditingOption iconPath="/icons/whiteText.png" />
            </div>
            <div onClick={() => setActionMode("drag")}>
              <EditingOptionSmallerImage iconPath="/icons/whiteHand.png" />
            </div>
            <div onClick={() => setActionMode("erase")}>
              <EditingOption iconPath="/icons/whiteRubber.png" />
            </div>
            <div onClick={() => {
              setActionMode("simulate")
              setEditMode("simulate")
            }}>
              <EditingOption iconPath="/icons/playIcon.png" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
