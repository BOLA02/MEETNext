"use client";
import { useState } from "react";

const CATEGORIES = [
  "Recommended",
  "Meetings",
  "Tasks and projects",
  "Documentation",
  "Product and design",
  "Engineering",
  "Sales and marketing",
  "Human resources",
  "Team collaboration",
  "Personal use",
];

const TEMPLATES = [
  {
    title: "Meeting Agenda",
    description: "Organize your meeting topics and action items.",
    category: "Meetings",
    url: "https://www.notion.so/templates/meeting-agenda",
    thumbnail: "https://www.notion.so/cdn-cgi/image/format=auto,width=384,quality=100/front-static/pages/templates/meeting-agenda.png",
  },
  {
    title: "Project Tracker",
    description: "Track project tasks, owners, and deadlines.",
    category: "Tasks and projects",
    url: "https://www.notion.so/templates/project-tracker",
    thumbnail: "https://www.notion.so/cdn-cgi/image/format=auto,width=384,quality=100/front-static/pages/templates/project-tracker.png",
  },
  {
    title: "Personal Tasks",
    description: "Manage your personal to-dos and priorities.",
    category: "Personal use",
    url: "https://www.notion.so/templates/personal-tasks",
    thumbnail: "https://www.notion.so/cdn-cgi/image/format=auto,width=384,quality=100/front-static/pages/templates/personal-tasks.png",
  },
  {
    title: "Team Tasks",
    description: "Collaborate on team tasks and progress.",
    category: "Team collaboration",
    url: "https://www.notion.so/templates/team-tasks",
    thumbnail: "https://www.notion.so/cdn-cgi/image/format=auto,width=384,quality=100/front-static/pages/templates/team-tasks.png",
  },
  {
    title: "Meeting Notes (Google Docs)",
    description: "Google Docs template for meeting notes.",
    category: "Meetings",
    url: "https://docs.google.com/document/u/0/?ftv=1&tgif=d",
    thumbnail: "https://ssl.gstatic.com/docs/templates/thumbnails/meetings.png",
  },
  {
    title: "Content Calendar (Coda)",
    description: "Plan and schedule your content.",
    category: "Sales and marketing",
    url: "https://coda.io/templates/content-calendar",
    thumbnail: "https://coda.io/static/images/templates/content-calendar.png",
  },
  // Add more templates as needed
];

export default function TemplatePickerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState("Recommended");
  const filtered = selectedCategory === "Recommended"
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === selectedCategory);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 bg-gray-50 border-r p-6 flex flex-col gap-2">
          <div className="font-bold text-lg mb-4">Templates</div>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`text-left px-2 py-1 rounded transition font-medium ${selectedCategory === cat ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Main content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="text-xl font-bold">{selectedCategory}</div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-bold">×</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map(t => (
              <div key={t.title} className="bg-white border rounded-xl shadow hover:shadow-lg transition flex flex-col">
                <img src={t.thumbnail} alt={t.title} className="rounded-t-xl h-32 object-cover w-full" />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="font-semibold text-lg mb-1">{t.title}</div>
                  <div className="text-gray-500 text-sm mb-2 flex-1">{t.description}</div>
                  <button
                    className="mt-auto bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
                    onClick={() => window.open(t.url, "_blank")}
                  >
                    Use this template
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-gray-400 col-span-full">No templates found.</div>}
          </div>
        </div>
      </div>
    </div>
  );
} 