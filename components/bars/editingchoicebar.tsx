import { useContext } from "react";
import { EditingOption } from "../icons/editingoption";
import { Logo } from "../icons/logo";
import { AppContext } from "@/state/global";

export function EditingChoiceBar() {
  const [appState, dispatch] = useContext(AppContext);

  function setEditingMode(data: string){
    dispatch({type:"CHANGE_EDIT", data: data});
  }

  return (
    <>
      <div>
        <div className="flex flex-shrink md:pl-5 gap-x-2 md:gap-2">
          <div
            onClick={() => setEditingMode("home")}
            className="cursor-pointer">
            <Logo />
          </div>
          <div className="flex flex-shrink pl-12 gap-6">
            <div onClick={() => setEditingMode("ink")}>
              <EditingOption iconPath="/icons/ink.png" />
            </div>
            <div onClick={() => setEditingMode("text")}>
              <EditingOption iconPath="/icons/text.png" />
            </div>
            <div onClick={() => setEditingMode("drag")}>
              <EditingOption iconPath="/icons/drag.png" />
            </div>
            <div onClick={() => setEditingMode("erase")}>
              <EditingOption iconPath="/icons/erase.png" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
