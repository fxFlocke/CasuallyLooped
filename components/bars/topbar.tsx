import { InformationBar } from "./informationbar";
import {useContext, useEffect } from "react";
import { Configuration } from "@/datatypes/commondatatypes";
import { NodeBar } from "./nodebar";
import { EdgeBar } from "./edgebar";
import { EditingChoiceBar } from "./editingchoicebar";
import { AppContext } from "@/state/global";
import { TextBar } from "./textbar";
import { SimulationBar } from "./smiulationbar";

export function Topbar() {
  const [appState, dispatch] = useContext(AppContext);

  useEffect(() => {
  }, [appState.config.editMode, appState.config.node])

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 items-center justify-start text-center h-[120px] bg-[#1c1d1d] rounded-2xl border-4 border-stone-300 bg-opacity-90 fixed">
        <EditingChoiceBar/>
        <div className="flex flex-shrink w-full gap-2">
          {appState.config.editMode === "node" && (
            <NodeBar/>
          )}
          {appState.config.editMode === "edge"  && (
            <EdgeBar/>
          )}
          {appState.config.editMode === "text" && (
            <TextBar/>)}
          {appState.config.editMode === "" && (
            <InformationBar/>)}
          {appState.config.actionMode === "simulate" && (
            <SimulationBar/>)}
        </div>
      </div>
    </div>
  );
}
