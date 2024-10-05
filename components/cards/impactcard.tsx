import { Dispatch, SetStateAction } from "react";
import Image from "next/image";

export function ImpactCard({
  impact,
  setImpact,
}: {
  impact: number;
  setImpact: Dispatch<SetStateAction<number>>;
}) {
  return (
    <>
      <div className="grid grid-cols-1 w-[158px] h-[90px] overflow-hidden rounded-lg shadow-lg bg-[#2d4a64] normal-case">
        <div className="pt-[10px] pl-1 h-28">
          <label
            form="impact"
            className="pr-1 pb-4 text-sm font-light text-black dark:text-gray-300">
            Impact
          </label>
          <Image
            src="/sliders/strength.png"
            alt="Profilbild"
            width={150}
            height={150}
            className="rounded-xl mt-2"
          />
        </div>
      </div>
    </>
  );
}
