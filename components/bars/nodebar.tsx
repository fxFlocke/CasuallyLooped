import { Configuration, NodeConfiguration } from "@/datatypes/commondatatypes";
import { LabelCard } from "../cards/labelcard";
import { ColorCard } from "../cards/colorcard";
import { ValueCard } from "../cards/valuecard";

export function NodeBar() {

  return (
    <>
      <div className="grid grid-cols-3 gap-x-8 pl-4">
        <LabelCard/>
        <ColorCard/>
        <ValueCard/>
      </div>
    </>
  );
}
