import { RxCross2 } from 'react-icons/rx';
export default function Modal({ close }: { close: () => void }) {
  return (
    <div
      className="w-screen h-screen absolute bg-slate-400 bg-opacity-70 p-20 border-2"
      onClick={close}
    >
      <div
        className="bg-white h-full border-2 p-10 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end absolute right-4 top-4">
          <RxCross2 className="text-3xl" onClick={close} />
        </div>
        <div className="flex justify-around items-center h-full">
          <button className="bg-green-500 p-4 rounded-xl">Simulate</button>
          <button className="bg-red-500 p-4 rounded-xl">Cancel</button>
        </div>
      </div>
    </div>
  );
}
