import { EdgeConfiguration } from "@/datatypes/commondatatypes";
import { useContext } from "react";
import { AppContext } from "@/state/global";
import { ImpactCard } from "../cards/impactcard";
import { AllowanceCard } from "../cards/allowancecard";

export function EdgeBar() {
  const [appState, dispatch] = useContext(AppContext)

  return (
    <>
      <div className="flex w-full gap-12 place-content-center place-items-center">
        <ImpactCard/>
        <AllowanceCard/>
      </div>
    </>
  );
}
