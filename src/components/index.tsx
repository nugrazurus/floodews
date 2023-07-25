"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export interface SensorProps {
  icon: string;
  title: string;
  value: number;
  unit: string;
}

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState(true);
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const isMobile = useMediaQuery({ maxWidth: 640 });
  useEffect(() => {
    setExpanded(!isMobile)
    console.log(isMobile)
  }, [isMobile])
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
      <div className={`${expanded ? "pl-56 transition-all duration-300" : "pl-16 transition-all duration-300"}`}>
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

export const Sensors = ({
  sensors,
  timestamp,
}: {
  sensors: SensorProps[];
  timestamp: number;
}) => {
  const date = new Date(timestamp);
  return (
    <div>
      <p className="text-right text-gray-700">
        Last Updated: {date.toDateString()}
      </p>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
        {sensors &&
          sensors.map((sensor, key) => (
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
