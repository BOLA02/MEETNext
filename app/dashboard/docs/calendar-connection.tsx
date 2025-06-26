"use client";
import { useState } from "react";

export default function CalendarConnection() {
  // Download a demo .ics file
  const handleDownloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Demo Meeting\nDTSTART:${getICSDate(30)}\nDTEND:${getICSDate(60)}\nDESCRIPTION:This is a demo event.\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent.replace(/\\n/g, "\r\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Try to open the default calendar app
  const handleOpenCalendarApp = () => {
    window.location.href = "webcal://calendar.google.com/calendar/ical";
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto mt-8 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Open or Import to Your Calendar</h2>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-blue-700 transition mb-4"
        onClick={handleOpenCalendarApp}
      >
        Open Calendar App
      </button>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-green-700 transition mb-4"
        onClick={handleDownloadICS}
      >
        Download .ics Event File
      </button>
      <span className="text-gray-500 text-sm mt-2 text-center">
        "Open Calendar App" will try to launch your device's default calendar app (may not work on all browsers/devices).<br />
        "Download .ics Event File" lets you import a meeting into any calendar app.
      </span>
    </div>
  );
}

function getICSDate(offsetMinutes: number) {
  const d = new Date(Date.now() + offsetMinutes * 60000);
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
} 