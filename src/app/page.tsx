import { GetSensorValue } from "@/components";


export default function Home() {
  const time = new Date();
  return (
    <main>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-700">DASHBOARD</h1>
        <p className="text-md text-gray-500">{time.toDateString()}</p>
      </div>
      <GetSensorValue />
    </main>
  );
}
