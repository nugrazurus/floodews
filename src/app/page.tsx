"use client";
import { SensorProps, Sensors } from "@/components";
import useSWR from "swr";

async function getSensorValue(url: string) {
  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
}

export default function Home() {
  const basePath = typeof window != "undefined" && window.location.origin;

  const { data, error } = useSWR(
    `${basePath ? basePath : ""}/api/v1/weather`,
    getSensorValue
  );

  if (!data) return <p>Loading...</p>;
  if (error) return <p>Failed to fetch</p>

  const time = new Date();
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
    <main>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-700">DASHBOARD</h1>
        <p className="text-md text-gray-500">{time.toDateString()}</p>
      </div>
      <Sensors sensors={sensors} timestamp={data.data.timestamp} />
    </main>
  );
}
