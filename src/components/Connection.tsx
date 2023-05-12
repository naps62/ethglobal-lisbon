export default function Connection({ isConnected = false }) {
  const green = "bg-green-500";
  const red = "bg-red-500";
  console.log("isConnected", isConnected);
  return (
    <div className="flex items-center">
      <div
        className={`w-2 h-2 ${isConnected ? green : red} rounded-full mr-2`}
      />
      <div>{isConnected ? "connected" : "not connected"}</div>
    </div>
  );
}
