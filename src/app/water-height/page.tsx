"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import useSWR from "swr";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function WaterHeight() {
  const now = new Date();
  const [date, setDate] = useState("");

  const handleDateChange = (event: any) => {
    setDate(event.target.value);
  };
  return (
    <main>
      <h1 className="text-lg font-semibold text-gray-700">WATER HEIGHT</h1>
      <p className="text-gray-500">{now.toDateString()}</p>
      <div className="rounded-lg shadow-md  p-4 mb-4 text-gray-500">
        <div className="flex w-full mb-4">
          <div className="w-3/4">
            <h3 className="font-medium text-gray-700 text-md">
              Realtime Condition
            </h3>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:map-marker" />
              JL. Sepakat 2 Pontianak, Kalimantan Barat, Indonesia
            </div>
            <p>Nearest Observation Location (RUSUNAWA UNTAN):</p>
          </div>
          <div className="flex w-1/4">
            <div className="flex flex-col">
              <label className="text-base font-medium" htmlFor="">
                Select date
              </label>
              <input
                className="border rounded-lg border-gray-500 p-2 text-sm"
                type="date"
                onChange={handleDateChange}
              />
            </div>
          </div>
        </div>
        <WaterHeightChart date={date} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg shadow-md p-4">
          <h3 className="font-medium mb-2">Status</h3>
          <ul>
            <li className="flex gap-2 items-center">
              <Circle bgColor="bg-red-500" /> Danger 1
            </li>
            <li className="flex gap-2 items-center">
              <Circle bgColor="bg-red-400" />
              Danger 2
            </li>
            <li className="flex gap-2 items-center">
              <Circle bgColor="bg-orange-400" />
              Danger 3
            </li>
            <li className="flex gap-2 items-center">
              <Circle bgColor="bg-green-400" />
              Normal
            </li>
          </ul>
        </div>
        <div className="col-span-2 shadow-md rounded-lg p-4">
          <h3 className="font-medium">ATTENTION</h3>
        </div>
      </div>
    </main>
  );
}

const Circle = ({ bgColor }: { bgColor: string }) => {
  return <div className={`rounded-full w-3 h-3 ${bgColor}`}></div>;
};

const WaterHeightChart = ({ date }: { date?: string }) => {
  const basePath = typeof window !== "undefined" && window.location.origin;
  const fetcher = async (url: string) => await fetch(url).then((r) => r.json());
  const { data, error } = useSWR(
    `${basePath ? basePath : ''}/api/v1/water-height${
      date && date != "" ? `?date=${date}` : ""
    }`,
    fetcher
  );

  if (!data) return <p>Loading...</p>;
  if (error) return <p className="text-red-500 text-center">Failed to fetch data</p>;

  const labels = data.data.map((val: any) =>
    new Date(val.timestamp).toLocaleTimeString()
  );
  const values = data.data.map((val: any) => 200 - val.height);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Water Height",
        data: values,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
    },
  };
  return (
    <div className="w-[99%] h-[42rem]">
      <Line className="relative" options={chartOptions} data={chartData} />
    </div>
  );
};
