"use client";

import { useEffect, useMemo, useState } from "react";

type CityClock = {
  label: string;
  timeZone: string;
};

const cities: CityClock[] = [
  { label: "Berlin", timeZone: "Europe/Berlin" },
  { label: "İstanbul", timeZone: "Europe/Istanbul" },
  { label: "New York", timeZone: "America/New_York" },
];

const formatterCache = new Map<string, Intl.DateTimeFormat>();

const getFormatter = (timeZone: string) => {
  if (!formatterCache.has(timeZone)) {
    formatterCache.set(
      timeZone,
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        timeZone,
      })
    );
  }

  return formatterCache.get(timeZone)!;
};

const getClockState = (timeZone: string, date: Date) => {
  const formatter = getFormatter(timeZone);
  const parts = formatter.formatToParts(date);
  const hourPart = parts.find((part) => part.type === "hour");
  const minutePart = parts.find((part) => part.type === "minute");

  const rawHour = parseInt(hourPart?.value ?? "0", 10);
  const minute = parseInt(minutePart?.value ?? "0", 10);
  const hour = Number.isNaN(rawHour) ? 0 : rawHour;

  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;
  const formattedTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  return { hourAngle, minuteAngle, formattedTime };
};

const useCurrentTime = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return now;
};

export default function CityClockRow() {
  const now = useCurrentTime();

  const cityStates = useMemo(
    () =>
      cities.map((city) => ({
        ...city,
        ...getClockState(city.timeZone, now),
      })),
    [now]
  );

  return (
    <div className="header-clock-row" aria-label="Live city clocks">
      {cityStates.map((city) => (
        <div
          key={city.timeZone}
          className="header-clock"
          role="group"
          aria-label={`${city.label} clock`}
        >
          <span className="header-clock__label">{city.label}</span>
          <div className="header-clock__dial" aria-hidden="true">
            <span
              className="header-clock__hand header-clock__hand--hour"
              style={{ transform: `rotate(${city.hourAngle}deg)` }}
            />
            <span
              className="header-clock__hand header-clock__hand--minute"
              style={{ transform: `rotate(${city.minuteAngle}deg)` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
