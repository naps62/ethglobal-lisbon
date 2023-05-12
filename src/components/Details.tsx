import { useState } from 'react';

export default function Details() {
  const [active, setActive] = useState('assets');
  return (
    <div className="">
      <Menu active={active} setActive={setActive} />
      <div className=""></div>
    </div>
  );
}

function Menu({
  active,
  setActive,
}: {
  active: string;
  setActive: (s: string) => void;
}) {
  return (
    <div className="flex justify-around border-b-2">
      <div
        className={`${
          active === 'assets' && 'text-blue-500 border-b-2 border-blue-500'
        }`}
        onClick={() => setActive('assets')}
      >
        Assets
      </div>
      <div
        className={`${
          active === 'activity' && 'text-blue-500 border-b-2 border-blue-500'
        }`}
        onClick={() => setActive('activity')}
      >
        Activity
      </div>
    </div>
  );
}
