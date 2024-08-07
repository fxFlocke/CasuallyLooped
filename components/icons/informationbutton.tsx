export function InformationButton({ label }: { label: string }) {
  return (
    <>
      <div className="flex flex-shrink justify-center items-center w-[140px] h-[120px] sm:h-[40px] bg-[#2d4a64] lg:text-lg content-around ease-in rounded-lg cursor-pointer hover:scale-105 duration-300 text-xs font-light text-black dark:text-gray-300">
        <a>{label}</a>
      </div>
    </>
  );
}
