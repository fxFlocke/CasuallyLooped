import Image from "next/image";

export function EditingOption({ iconPath }: { iconPath: string }) {
  return (
    <>
      <div className="grid items-center w-[50px] h-[50px] text-xs lg:text-lg content-center ease-in cursor-pointer hover:scale-95 duration-300 hover:shadow-white hover:shadow-outer overflow-hidden rounded-lg shadow-sm bg-[#2b2d2d] normal-case">
        <Image
          src={iconPath}
          alt="Home"
          width={50}
          height={50}
          className="rounded-2xl cursor-pointer"
        />
      </div>
    </>
  );
}

export function EditingOptionSmallerImage({ iconPath }: { iconPath: string }) {
  return (
    <>
      <div className="grid items-center w-[50px] h-[50px] text-xs lg:text-lg content-center ease-in cursor-pointer hover:scale-95 duration-300 hover:shadow-white hover:shadow-outer overflow-hidden rounded-lg shadow-sm bg-[#2b2d2d] normal-case">
        <div className="flex justify-center content-center">
        <Image
          src={iconPath}
          alt="Home"
          width={40}
          height={40}
          className="rounded-2xl cursor-pointer"
        />
        </div>
      </div>
    </>
  );
}