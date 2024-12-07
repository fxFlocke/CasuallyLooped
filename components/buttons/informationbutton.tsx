export function InformationButton({ label }: { label: string }) {
  return (
    <>
      <div className="flex flex-shrink justify-center items-center w-[140px] h-[120px] sm:h-[40px] bg-[#2b2d2d] lg:text-lg content-around ease-in cursor-pointer hover:scale-95 duration-300 hover:shadow-white hover:shadow-outer overflow-hidden rounded-lg shadow-sm normal-case text-xs font-light text-black dark:text-gray-300 hover:shadow-outer">
        <a>{label}</a>
      </div>
    </>
  );
}
