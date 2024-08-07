import { EdgeConfiguration } from "@/datatypes/commondatatypes";
import { useContext } from "react";
import { AppContext } from "@/state/global";

export function EdgeBar() {
  const [appState, dispatch] = useContext(AppContext)

  return (
    <>
      <div></div>
    </>
  );
}
