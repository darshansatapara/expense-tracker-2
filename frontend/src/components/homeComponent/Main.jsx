import React from "react";
import LineGraph from "./Graph";

export default function Main() {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Graph Container 1 */}
      <div className="flex-1 bg-white shadow-lg rounded-md p-4  md:w-[48%]">
        <LineGraph className="w-full h-[250px] md:h-[400px]" />
      </div>

      {/* Graph Container 2 */}
      <div className="flex-1 bg-white shadow-lg rounded-md p-4  md:w-[48%]">
        <LineGraph className="w-full h-[250px] md:h-[400px]" />
      </div>
    </div>
  );
}
