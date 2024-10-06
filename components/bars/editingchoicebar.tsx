import { useContext } from "react";
import { EditingOption, EditingOptionSmallerImage } from "../icons/editingoption";
import { Logo } from "../icons/logo";
import { AppContext } from "@/state/global";

export function EditingChoiceBar() {
  const [appState, dispatch] = useContext(AppContext);

  function setActionMode(data: string){
    dispatch({type:"CHANGE_ACTION_MODE", data: data});
  }

  function setEditMode(data: string){
    dispatch({type:"CHANGE_EDIT_MODE", data: data});
  }

  function setViewMode(){
    var data
    switch(appState.config.viewMode){
      case "2D":
        data = "3D"
        break
      case "3D":
        data = "2D"
        break
    }
    dispatch({type:"CHANGE_VIEW_MODE", data: data})
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
            <div onClick={() => setViewMode()}>
              {
                appState.config.viewMode === "2D" && <EditingOptionSmallerImage iconPath="/icons/2d.png"/> ||
                appState.config.viewMode === "3D" && <EditingOptionSmallerImage iconPath="/icons/3d.png"/>
              }
            </div>
            <div onClick={() => {
              setActionMode("ink")
              setEditMode("node")
            }}>
              <EditingOptionSmallerImage iconPath="/icons/whitePencil.png" />
            </div>
            <div onClick={() => setActionMode("text")}>
              <EditingOptionSmallerImage iconPath="/icons/whiteText.png" />
            </div>
            <div onClick={() => setActionMode("drag")}>
              <EditingOptionSmallerImage iconPath="/icons/whiteHand.png" />
            </div>
            <div onClick={() => setActionMode("erase")}>
              <EditingOption iconPath="/icons/whiteRubber.png" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
