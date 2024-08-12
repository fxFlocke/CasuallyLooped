import { InformationBar } from "./informationbar";
import {useContext, useEffect } from "react";
import { Configuration } from "@/datatypes/commondatatypes";
import { NodeBar } from "./nodebar";
import { EdgeBar } from "./edgebar";
import { EditingChoiceBar } from "./editingchoicebar";
import { AppContext } from "@/state/global";

export function Topbar() {
  const [appState, dispatch] = useContext(AppContext);

  useEffect(() => {
    console.log(appState.config.editMode)
  }, [appState.config.editMode])

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 items-center justify-start text-center w-full h-[120px] bg-[#28435a] rounded-2xl border-t border-b fixed">
        <EditingChoiceBar/>
        <div className="flex flex-shrink w-full gap-2 my-4">
          {(appState.config.editMode === "home" ||
            appState.config.editMode === "text" ||
            appState.config.editMode === "drag" ||
            appState.config.editMode === "erase") && <InformationBar />}
          {appState.config.editMode === "ink" && appState.config.node !== undefined && (
            <NodeBar/>
          )}
          {appState.config.editMode === "ink" && appState.config.edge !== undefined && (
            <EdgeBar/>
          )}
          {appState.config.editMode === "play" && <InformationBar />}
        </div>
      </div>
    </div>
  );
}
