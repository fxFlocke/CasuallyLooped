import { Loopy } from "@/components/diagram/loopy";
import { AppProvider } from "@/state/global";

export default function Home() {

  return (
    <>
      <div className="bg-[#747477] w-full min-h-screen h-max 2xl:pt-10">
        <div className="flex flex-col justify-start scpace-x-0 font-inter">
            <AppProvider>
              <Loopy />
            </AppProvider>
        </div>
      </div>
    </>
  );
}
