import Image from "next/image";

export function Logo() {
  return (
    <>
      <div className="flex flex-shrink justify-start items-center w-[220px] h-[70px] sm:h-[40px] bg-[#28435a] text-xs lg:text-lg content-around">
        <Image
          src={"/logos/logo.png"}
          alt="Home"
          width={200}
          height={200}
          className="rounded-2xl pl-2 pt-4"
        />
        <Image
          src={"/gifs/feature_draw.gif"}
          alt="Home"
          width={75}
          height={75}
          className="rounded-2xl absolute top-5 left-16"
        />
      </div>
    </>
  );
}
