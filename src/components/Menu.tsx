export const Menu = ({
  active,
  setActive,
}: {
  active: string;
  setActive: (s: string) => void;
}) => {
  return (
    <div className="flex justify-around border-b-2 mt-5">
      <div
        className={`${
          active === "activity" && "text-blue-500 border-b-2 border-blue-500"
        }`}
        onClick={() => setActive("activity")}
      >
        Assets
      </div>
      <div
        className={`${
          active === "assets" && "text-blue-500 border-b-2 border-blue-500"
        }`}
        onClick={() => setActive("assets")}
      >
        Address Finder
      </div>
      <div
        className={`${
          active === "union" && "text-blue-500 border-b-2 border-blue-500"
        }`}
        onClick={() => setActive("union")}
      >
        Union Finance
      </div>
    </div>
  );
};
