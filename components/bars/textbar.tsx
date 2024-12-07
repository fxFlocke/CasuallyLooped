import { EdgeConfiguration } from "@/datatypes/commondatatypes";
import { useContext } from "react";
import { AppContext } from "@/state/global";
import { ImpactCard } from "../cards/impactcard";
import { AllowanceCard } from "../cards/allowancecard";
import { TextCard } from "../cards/textcard";

export function TextBar() {
  const [appState, dispatch] = useContext(AppContext)

  return (
    <>
      <div className="flex w-full gap-12 place-content-center place-items-center">
        <TextCard/>
      </div>
    </>
  );
}
