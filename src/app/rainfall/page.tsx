import { RainfallChart } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "FloodEWS | Rainfall",
  };

export default function Rainfall() {
  const now = new Date();
  return (
    <main>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-700">RAINFALL</h1>
        <p className="text-gray-500">{now.toDateString()}</p>
      </div>
      <RainfallChart />
    </main>
  );
}
