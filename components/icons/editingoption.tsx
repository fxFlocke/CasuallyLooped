import Image from "next/image";

export function EditingOption({ iconPath }: { iconPath: string }) {
  return (
    <>
      <div className="grid items-center w-[50px] h-[50px] text-xs lg:text-lg content-center ease-in cursor-pointer hover:scale-105 duration-300 hover:shadow-cyan-400 hover:shadow-inner overflow-hidden rounded-lg shadow-lg bg-[#2d4a64] normal-case">
        <Image
          src={iconPath}
          alt="Home"
          width={50}
          height={50}
          className="rounded-2xl"
        />
      </div>
    </>
  );
}
