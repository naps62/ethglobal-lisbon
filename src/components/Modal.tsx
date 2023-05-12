import { RxCross2 } from 'react-icons/rx';
export default function Modal({ close }: { close: () => void }) {
  return (
    <div className="w-screen h-screen absolute bg-slate-400 bg-opacity-70 p-20 border-2  ">
      <div className="bg-white h-full border-2 p-10">
        <div className="flex justify-end">
          <RxCross2 className="text-3xl" onClick={close} />
        </div>
        <div className="flex justify-around pt-44">
          <button className="bg-green-500 p-4 rounded-xl">Simulate</button>
          <button className="bg-red-500 p-4 rounded-xl">Cancel</button>
        </div>
      </div>
    </div>
  );
}
