import { InformationButton } from "../icons/informationbutton";

export function InformationBar() {
  return (
    <>
      <div className="grid grid-rows-2 gap-y-2 pl-2">
        <div className="grid grid-cols-4 gap-x-4">
          <InformationButton label="Examples" />
          <InformationButton label="How to" />
          <InformationButton label="Create Gif" />
          <InformationButton label="Credits" />
        </div>
        <div className="grid grid-cols-4 gap-x-4">
          <InformationButton label="Link" />
          <InformationButton label="File" />
          <InformationButton label="Load" />
          <InformationButton label="Embed" />
        </div>
      </div>
    </>
  );
}
