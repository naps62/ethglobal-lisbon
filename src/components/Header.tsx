import { RxHamburgerMenu } from 'react-icons/rx';
import Network from './Network';
import Connection from './Connection';
export default function Header() {
  return (
    <div className="w-full bg-blue-500 h-16 flex items-center justify-between px-4 text-white">
      <RxHamburgerMenu />
      <Network />
      <Connection />
    </div>
  );
}
