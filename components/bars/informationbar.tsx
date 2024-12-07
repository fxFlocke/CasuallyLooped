import { ExampleButton } from "../buttons/examplebutton";
import { ExportButton } from "../buttons/exportbutton";
import { ImportButton } from "../buttons/importbutton";
import { InformationButton } from "../buttons/informationbutton";

export function InformationBar() {
  return (
    <>
      <div className="w-full grid grid-cols-3 px-8 place-items-center place-content-center">

          <ExampleButton/>
          <ExportButton/>
          <ImportButton/>

      </div>
    </>
  );
}
