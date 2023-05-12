export default function Modal() {
  return (
    <div className="w-screen h-screen absolute bg-slate-400 bg-opacity-70 p-20 ">
      <div className="bg-white h-full">
        <button>Simulate</button>
        <button>Cancel</button>
      </div>
    </div>
  );
}
