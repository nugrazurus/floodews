import { Metadata } from "next";
import { Circle, WaterHeightChart } from "@/components";

export const metadata: Metadata = {
  title: "FloodEWS | Water Height",
};

export default function WaterHeight() {
  const now = new Date();

  return (
    <main>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-700">WATER HEIGHT</h1>
        <p className="text-gray-500">{now.toDateString()}</p>
      </div>
      <WaterHeightChart />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 shadow-md p-4 overflow-x-auto">
          <h3 className="font-medium mb-2">Status</h3>
          <ul>
            <li className="flex gap-2 items-center">
              <Circle bgColor="bg-red-500" /> Danger 1
            </li>
            <li className="flex gap-2 items-center">
              <Circle bgColor="bg-orange-500" />
              Danger 2
            </li>
            <li className="flex gap-2 items-center">
              <Circle bgColor="bg-yellow-500" />
              Danger 3
            </li>
            <li className="flex gap-2 items-center">
              <Circle bgColor="bg-green-500" />
              Normal
            </li>
          </ul>
        </div>
        <div className="md:col-span-2 border border-gray-200 shadow-md rounded-lg p-4 overflow-x-auto">
          <h3 className="font-medium">Attention</h3>
        </div>
      </div>
    </main>
  );
}
