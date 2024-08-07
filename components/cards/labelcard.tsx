import { useContext } from "react";
import { AppContext } from "@/state/global";

export function LabelCard() {
  const [ appState, dispatch ] = useContext(AppContext);

  return (
    <>
      <div className="grid grid-cols-1 w-[158px] h-[90px] overflow-hidden rounded-lg shadow-lg bg-[#2d4a64] normal-case">
        <div className="justify-start pt-[10px] pl-[15px] h-28">
          <label
            form="name"
            className="pr-[100px] block mb-2 text-sm font-light text-black dark:text-gray-300"
          >
            Label
          </label>
          <input
            type="text"
            id="label"
            value={appState.config.node.label}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({type:"CHANGE_LABEL", data: e.target.value})
            }
            className="bg-gray-30 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-100 focus:border-blue-100 block w-[125px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-100 dark:focus:border-blue-100"
            required
          />
        </div>
      </div>
    </>
  );
}
