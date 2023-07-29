import { WeatherChart } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FloodEWS | Weather",
};

export default function Weather() {
  const now = new Date();
  return (
    <main>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-700">WEATHER</h1>
        <p className="text-gray-500">{now.toDateString()}</p>
      </div>
      <WeatherChart />
    </main>
  );
}
