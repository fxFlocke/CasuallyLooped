import { AppContext } from '@/state/global';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useContext, useState } from 'react'
import Loopy from '../../public/files/loopy.json'
import { AdjustNodePositions, AdjustTextPositions } from '@/functionality/geometry';

export function ExampleButton() {
    let [isOpen, setIsOpen] = useState(false)
    const [ appState, dispatch ] = useContext(AppContext);

    function open() {
      setIsOpen(true)
    }
  
    function close() {
      setIsOpen(false)
    }

    function loadExample(){
      dispatch({type: "EDIT", data: AdjustNodePositions(Loopy.nodes, Loopy.dimensions, {x: window.innerWidth, y: window.innerHeight})})
      dispatch({type: "EDIT_TEXTS", data: AdjustTextPositions(Loopy.texts, Loopy.dimensions, {x: window.innerWidth, y: window.innerHeight})})
    }

    return (
      <>
        <div className="flex flex-shrink justify-center items-center w-[140px] h-[120px] sm:h-[40px] lg:text-lg content-around ease-in cursor-pointer hover:scale-95 duration-300 hover:shadow-white hover:shadow-outer overflow-hidden shadow-sm normal-case dark:text-gray-300 hover:shadow-outer gap-2 rounded-md bg-[#2b2d2d] py-1.5 px-3 text-sm/6 font-semibold text-white"
             onClick={open}>
          <a>Example</a>
        </div>


        <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md bg-[#2b2d2d] shadow-lg shadow-white border-white border-2 rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-medium text-white flex justify-center py-2 bg-opacity-20">
                Load `Liquidity Pool` Example
              </DialogTitle>
              <div className="mt-2 text-sm/6 text-white/50 grid grid-cols-1 place-items-center py-2">
                <p>This example provieds an overview of</p>
                <p>casualities for a Liquidity Pool that</p>
                <p>has an Asset-Volatility Policy-Function enabled,</p>
                <p>which helps to adjust Fees to Market Conditions.</p>
              </div>
              <div className="mt-4 grid grid-cols-2 mx-4 gap-16 py-2">
                <button
                  className="flex justify-center items-center gap-2 rounded-md bg-[#2b2d2d] py-1.5 px-3 text-sm/6 font-semibold text-white shadow-white/10 focus:outline-none content-around ease-in cursor-pointer hover:scale-95 duration-300 hover:shadow-white hover:shadow-outer overflow-hidden shadow-sm"
                  onClick={ () => {
                    close()
                    loadExample()
                  }}>
                  Yes
                </button>
                <button
                  className="flex justify-center items-center gap-2 rounded-md bg-[#2b2d2d] py-1.5 px-3 text-sm/6 font-semibold text-white shadow-white/10 focus:outline-none content-around ease-in cursor-pointer hover:scale-95 duration-300 hover:shadow-white hover:shadow-outer overflow-hidden shadow-sm"
                  onClick={close}>
                  No
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      </>
    );
  }
  