"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import useSWR from "swr";

interface SensorProps {
  icon: string;
  title: string;
  value: number;
  unit: string;
}
const basePath = typeof window !== "undefined" && window.location.origin;

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState(true);
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const isMobile = useMediaQuery({ maxWidth: 640 });
  useEffect(() => {
    setExpanded(!isMobile);
  }, [isMobile]);
  return (
    <div>
      <aside
        className={`fixed top-0 left-0 flex flex-col min-h-screen p-4 bg-purple-800 text-white overflow-hidden ${
          expanded
            ? "w-56 transition-all duration-300"
            : "w-16 transition-all duration-300"
        }`}
      >
        <button className="text-left mb-4">
          <Icon icon="mdi:menu" className="text-2xl" onClick={toggleSidebar} />
        </button>
        <Link
          href="/"
          className="flex flex-row items-center justify-center text-xl font-bold gap-2"
        >
          <Icon icon="mdi:home-flood" className="text-4xl" />
          {expanded && "Flood EWS"}
        </Link>
        <div className="flex-1 py-8 overflow-y-auto">
          <ul className="text-sm font-medium">
            <li>
              <Menu
                path="/water-height"
                name="Water Height History"
                icon="mdi:waves-arrow-up"
                expanded={expanded}
              />
            </li>
            <li>
              <Menu
                path="/weather"
                name="Weather History"
                icon="mdi:weather-dust"
                expanded={expanded}
              />
            </li>
            <li>
              <Menu
                path="/rainfall"
                name="Rainfall History"
                icon="mdi:weather-rainy"
                expanded={expanded}
              />
            </li>
          </ul>
        </div>
      </aside>
      <div
        className={`${
          expanded
            ? "pl-56 transition-all duration-300"
            : "pl-16 transition-all duration-300"
        }`}
      >
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
};

const Menu = ({
  path,
  name,
  icon,
  expanded,
}: {
  path: string;
  name: string;
  icon: string;
  expanded: boolean;
}) => {
  const pathname = usePathname();
  const isActive = (path: string) => path == pathname;
  return (
    <Link
      className={`flex items-center py-2 gap-2 ${
        isActive(path) ? "text-white" : "text-purple-500"
      }`}
      href={path}
    >
      <Icon
        icon={icon}
        className={`text-3xl p-1 border-2 rounded-lg ${
          isActive(path) ? "border-white" : "border-purple-500"
        }`}
      />
      {expanded && name}
    </Link>
  );
};

export const Toast = ({
  message,
  isShow = false,
}: {
  message: string;
  isShow?: boolean;
}) => {
  const [show, setShow] = useState(isShow);
  const handleClose = () => {
    setShow(false);
  };
  return (
    <div
      className={`${
        show ? "flex" : "hidden"
      } fixed top-2 right-2 z-30 items-center w-full max-w-xs p-4 text-gray-700 bg-white rounded-lg shadow border border-gray-300 transition-all duration-100`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
        <Icon icon="mdi:alert-circle" />
      </div>
      <div className="ml-3 text-sm font-normal">Failed to fetch data</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
        onClick={handleClose}
      >
        <span className="sr-only">Close</span>
        <Icon icon="mdi:close" />
      </button>
    </div>
  );
};

export const Circle = ({ bgColor }: { bgColor: string }) => {
  return <div className={`rounded-full w-3 h-3 ${bgColor}`}></div>;
};

export const GetSensorValue = () => {
  const fetcher = async (url: string) => await fetch(url).then((r) => r.json());
  const { data, error } = useSWR(basePath + "/api/v1/weather", fetcher);

  if (!data) return <p>Loading...</p>;
  if (error) return <Toast message="Failed to fetch" />;

  const date = new Date(data.timestamp);
  const sensors: SensorProps[] = [
    {
      title: "Temperature",
      value: data.data ? data.data.temperature.toFixed(2) : 0.0,
      unit: "&deg;Celcius",
      icon: "mdi:thermometer",
    },
    {
      title: "Humidity",
      value: data.data ? data.data.humidity.toFixed(2) : 0.0,
      unit: "%RH",
      icon: "mdi:water-percent-alert",
    },
    {
      title: "Pressure",
      value: data.data ? data.data.pressure.toFixed(2) : 0.0,
      unit: "hPa",
      icon: "mdi:gauge",
    },
    {
      title: "Altitude",
      value: data.data ? data.data.altitude.toFixed(2) : 0.0,
      unit: "MSL",
      icon: "mdi:image-filter-hdr",
    },
  ];
  return (
    <div>
      <p className="text-right text-gray-700">
        Last Updated: {date.toDateString()}
      </p>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
        {sensors.map((sensor, key) => (
          <SensorCard
            key={key}
            icon={sensor.icon}
            title={sensor.title}
            unit={sensor.unit}
            value={sensor.value}
          />
        ))}
      </div>
    </div>
  );
};

export const SensorCard = ({ icon, title, value, unit }: SensorProps) => {
  return (
    <div className="w-full flex flex-col aspect-square rounded-3xl shadow-md p-6 overflow-hidden">
      <h4 className="font-medium text-xl mb-2 text-gray-700">{title}</h4>
      <div className="my-auto">
        <div className="flex justify-between items-center font-medium text-4xl text-purple-800">
          {value}
          <Icon className="text-[5rem]" icon={icon} />
        </div>
        <p
          className="text-lg text-slate-400"
          dangerouslySetInnerHTML={{ __html: unit }}
        ></p>
      </div>
    </div>
  );
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LineChart = ({
  chartData,
  chartOptions,
  isLoading = false,
}: {
  chartData: ChartData<"line">;
  chartOptions: ChartOptions<"line">;
  isLoading?: boolean;
}) => {
  return (
    <div className="w-[99%] h-[42rem]">
      <Line className="relative" options={chartOptions} data={chartData} />
    </div>
  );
};

export const WeatherChart = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const handleDateChange = (event: any) => {
    router.push(`/weather?date=${event.target.value}`);
  };

  const basePath = typeof window !== "undefined" && window.location.origin;
  const fetcher = async (url: string) => await fetch(url).then((r) => r.json());
  const { data, error } = useSWR(
    basePath +
      "/api/v1/weather/history" +
      `${date && date != "" ? `?date=${date}` : ""}`,
    fetcher
  );

  let labels = [];
  let temperature = [];
  let humidity = [];
  let altitude = [];
  let pressure = [];

  if (data) {
    labels = data.data.map((val: any) =>
      new Date(val.timestamp).toLocaleTimeString()
    );
    temperature = data.data.map((val: any) => val.temperature);
    humidity = data.data.map((val: any) => val.humidity);
    altitude = data.data.map((val: any) => val.altitude);
    pressure = data.data.map((val: any) => val.pressure);
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Weather",
        data: temperature,
        fill: false,
        backgroundColor: "rgb(34, 197, 94)",
        borderColor: "rgb(34, 197, 94)",
        tension: 0.4,
        pointRadius: 1,
      },
      {
        label: "Humidity",
        data: humidity,
        fill: false,
        backgroundColor: "rgb(249, 115, 22)",
        borderColor: 'rgb(249, 115, 22)',
        tension: 0.4,
        pointRadius: 1,
      },
      {
        label: "Altitude",
        data: altitude,
        fill: false,
        backgroundColor: 'rgb(234, 179, 8)',
        borderColor: 'rgb(234, 179, 8)',
        tension: 0.4,
        pointRadius: 1,
      }
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
    <div className="rounded-lg shadow-lg border border-gray-200 p-4 mb-4 text-gray-500 overflow-x-auto">
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
      {data && <LineChart chartData={chartData} chartOptions={chartOptions} />}
      {error && <Toast message="Failed to fetch data" />}
    </div>
  );
};

export const WaterHeightChart = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const handleDateChange = (event: any) => {
    router.push(`/water-height?date=${event.target.value}`);
  };

  const fetcher = async (url: string) => await fetch(url).then((r) => r.json());
  const { data, error } = useSWR(
    basePath +
      "/api/v1/water-height" +
      `${date && date != "" ? `?date=${date}` : ""}`,
    fetcher
  );

  let values: any[] = [];
  let bgColor: any[] = [];
  let labels: any[] = [];

  if (data) {
    labels = data.data.map((val: any) =>
      new Date(val.timestamp).toLocaleTimeString()
    );
    values = data.data.map((val: any) => 200 - val.height);
    bgColor = data.data.map((val: any) => {
      const height = 200 - val.height;
      if (height < 70) {
        return "rgb(34, 197, 94)";
      } else if (height > 70 && height <= 80) {
        return "rgb(234, 179, 8)";
      } else if (height > 80 && height <= 90) {
        return "rgb(249, 115, 22)";
      } else if (height > 90 && height <= 100) {
        return "rgb(239, 68, 68)";
      } else if (height > 100) {
        return "rgb(239, 68, 68)";
      }
    });
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Water Height",
        data: values,
        fill: false,
        backgroundColor: bgColor,
        borderColor: bgColor,
        tension: 0.4,
        pointRadius: 10,
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
    <div className="rounded-lg shadow-lg border border-gray-200 p-4 mb-4 text-gray-500 overflow-x-auto">
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
      {data && <LineChart chartData={chartData} chartOptions={chartOptions} />}
      {error && <Toast message="Failed to fetch data" />}
    </div>
  );
};

export const RainfallChart = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const handleDateChange = (event: any) => {
    router.push(`/rainfall?date=${event.target.value}`);
  };

  const fetcher = async (url: string) => await fetch(url).then((r) => r.json());
  const { data, error } = useSWR(
    basePath +
      "/api/v1/rainfall" +
      `${date && date != "" ? `?date=${date}` : ""}`,
    fetcher
  );

  let values: any[] = [];
  let bgColor: any[] = [];
  let labels: any[] = [];

  if (data) {
    labels = data.data.map((val: any) =>
      new Date(val.timestamp).toLocaleTimeString()
    );
    values = data.data.map((val: any) => val.rain);
    bgColor = ["rgb(34, 197, 94)"];
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Rainfall",
        data: values,
        fill: false,
        backgroundColor: bgColor,
        borderColor: bgColor,
        tension: 0.4,
        pointRadius: 10,
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
    <div className="rounded-lg shadow-lg border border-gray-200 p-4 mb-4 text-gray-500 overflow-x-auto">
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
      {data && <LineChart chartData={chartData} chartOptions={chartOptions} />}
      {error && <Toast message="Failed to fetch data" />}
    </div>
  );
};
