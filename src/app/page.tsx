import { SensorProps, Sensors, Sidebar } from "@/components";

async function getSensorValue() {
  const res = await fetch("http://localhost:3000/api/v1/weather");

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
}

export default async function Home() {
  const sensorValue = await getSensorValue();
  const time = new Date();
  const sensors: SensorProps[] = [
    {
      title: "Temperature",
      value: sensorValue.data ? sensorValue.data.temperature.toFixed(2) : 0.0,
      unit: "&deg;Celcius",
      icon: "mdi:thermometer",
    },
    {
      title: "Humidity",
      value: sensorValue.data ? sensorValue.data.humidity.toFixed(2) : 0.0,
      unit: "%RH",
      icon: "mdi:water-percent-alert",
    },
    {
      title: "Pressure",
      value: sensorValue.data ? sensorValue.data.pressure.toFixed(2) : 0.0,
      unit: "hPa",
      icon: "mdi:gauge",
    },
    {
      title: "Altitude",
      value: sensorValue.data ? sensorValue.data.altitude.toFixed(2) : 0.0,
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
      <Sensors sensors={sensors} timestamp={sensorValue.data.timestamp} />
    </main>
  );
}
