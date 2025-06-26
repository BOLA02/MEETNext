"use client";

import { useState } from "react";
import { Plus, Folder, Star, Users, FileText, Bell, Calendar, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const initialDocs = [
  { name: "Welcome to MeetNext Docs!", creator: "You", time: "2 minutes ago", starred: false },
];
const initialFolders = [
  { name: "Team Docs", new: true },
  { name: "Projects" },
];

const sidebarItems = [
  { label: "Notifications", icon: Bell, badge: 1 },
  { label: "Recent", icon: FileText },
  { label: "My meetings", icon: Calendar, badge: "New" },
  { label: "My docs", icon: FileText },
  { label: "Shared with me", icon: Users },
  { label: "Starred", icon: Star },
];

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative animate-fade-in">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500"><X /></button>
        <div className="font-bold text-lg mb-4">{title}</div>
        {children}
      </div>
    </div>
  );
}

export default function DocsDashboard() {
  const [selected, setSelected] = useState("Recent");
  const [docs, setDocs] = useState(initialDocs);
  const [folders, setFolders] = useState(initialFolders);
  const [modal, setModal] = useState(null); // { type: string, data?: any }
  const [newDocName, setNewDocName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);
  const router = useRouter();

  // Sidebar filter logic
  const filteredDocs = selected === "Recent"
    ? docs
    : selected === "Starred"
      ? docs.filter(doc => doc.starred)
      : docs.filter(doc => doc.name.toLowerCase().includes(selected.toLowerCase()));

  // Modal handlers
  const openModal = (type, data) => setModal({ type, data });
  const closeModal = () => setModal(null);

  // Add new doc
  const handleAddDoc = () => {
    if (!newDocName.trim()) return;
    const newId = Math.random().toString(36).slice(2, 10);
    router.push(`/dashboard/docs/${newId}`);
    setDocs([{ name: newDocName, creator: "You", time: "just now", starred: false }, ...docs]);
    toast.success("Document created", { description: `"${newDocName}" was added to your docs.` });
    setNewDocName("");
    closeModal();
  };
  // Add new folder
  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    setFolders([...folders, { name: newFolderName }]);
    toast.success("Folder created", { description: `"${newFolderName}" was added to your folders.` });
    setNewFolderName("");
    closeModal();
  };
  // Delete doc
  const handleDeleteDoc = (name) => {
    setDocs(docs.filter(doc => doc.name !== name));
    toast("Document deleted", { description: `"${name}" was removed from your docs.` });
    closeModal();
  };
  // Star/unstar doc
  const handleToggleStar = (name) => {
    setDocs(docs => docs.map(doc => doc.name === name ? { ...doc, starred: !doc.starred } : doc));
    const doc = docs.find(doc => doc.name === name);
    if (doc) {
      toast(doc.starred ? "Removed from Starred" : "Added to Starred", { description: `"${name}" ${doc.starred ? "removed from" : "added to"} your starred docs.` });
    }
  };

  // Example doc row click handler:
  const handleDocClick = (id: string) => {
    router.push(`/dashboard/docs/${id}`);
  };

  return (
    <div className="flex flex-1 min-h-0 w-full">
      {/* Left sidebar */}
      <aside className="w-72 border-r bg-white flex flex-col min-h-0 p-4">
        <div className="flex items-center gap-2 mb-6">
          <span className="font-bold text-lg text-[#7c3aed]">Docs</span>
          <button className="ml-auto p-1.5 rounded hover:bg-gray-100 transition" title="Add new" onClick={() => openModal("newDoc")}> <Plus className="w-5 h-5 text-gray-500" /> </button>
        </div>
        <div className="mb-4">
          <input className="w-full px-3 py-2 rounded bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="Search" />
        </div>
        <nav className="flex flex-col gap-1 mb-6">
          {sidebarItems.map(item => (
            <button key={item.label} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${selected === item.label ? "bg-[#f3f4f6] text-[#7c3aed]" : "text-gray-700 hover:bg-gray-100"}`} onClick={() => setSelected(item.label)}>
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge && (<span className="ml-auto text-xs bg-purple-100 text-purple-700 rounded-full px-2 py-0.5 font-semibold">{item.badge}</span>)}
            </button>
          ))}
        </nav>
        <div className="mb-4">
          <div className="text-xs text-gray-400 font-semibold mb-2">Shared folders <span className="ml-1 text-blue-500">New</span></div>
          <div className="flex flex-col gap-1">
            {folders.map(f => (
              <div key={f.name} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer text-sm">
                <Folder className="w-4 h-4 text-gray-400" />
                <span>{f.name}</span>
                {f.new && <span className="ml-auto text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-semibold">New</span>}
              </div>
            ))}
          </div>
          <button className="mt-2 text-xs text-blue-600 hover:underline" onClick={() => openModal("newFolder")}>Create a new shared folder</button>
        </div>
        <div className="flex gap-2 mt-auto text-gray-400 text-xs items-center">
          <button className="hover:text-red-500"><span role="img" aria-label="delete">🗑️</span></button>
          <button className="hover:text-blue-500"><span role="img" aria-label="help">❓</span></button>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-0 bg-white p-8">
        {/* Banner */}
        <div className="w-full bg-[#f3fdf6] border border-[#d1fae5] rounded-xl p-6 flex items-center gap-6 mb-8">
          <div className="flex-1">
            <div className="font-semibold text-lg mb-1 text-[#0f5132]">Run efficient meeting with ready-made templates</div>
            <div className="text-gray-600 text-sm mb-2">Save time by using pre-built templates to create your docs</div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow mr-2" onClick={() => openModal("agenda")}>Create a meeting agenda</button>
            <button className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-full text-sm font-bold shadow hover:bg-blue-50" onClick={() => openModal("viewMore")}>View more</button>
          </div>
        </div>
        {/* Recent docs */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-lg">Recent</span>
            <div className="flex gap-2">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2" onClick={() => openModal("newDoc")}> <Plus className="w-4 h-4" />New document</button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2" onClick={() => openModal("newTable")}>New data table <span className="ml-1 text-blue-500 text-xs">New</span></button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2" onClick={() => openModal("fromMeetings")}>Create from meetings</button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2" onClick={() => openModal("templates")}>Templates</button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2" onClick={() => openModal("import")}>Import</button>
            </div>
          </div>
          <div className="bg-white border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b">
                  <th className="text-left px-6 py-3 font-medium">Name</th>
                  <th className="text-left px-6 py-3 font-medium">Creator</th>
                  <th className="text-left px-6 py-3 font-medium">Last viewed</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map(doc => (
                  <tr key={doc.name} className="border-b hover:bg-gray-50 transition cursor-pointer" onClick={() => handleDocClick(doc.name)}>
                    <td className="px-6 py-3">
                      <span role="img" aria-label="wave">👋</span> {doc.name}
                    </td>
                    <td className="px-6 py-3">{doc.creator}</td>
                    <td className="px-6 py-3">{doc.time}</td>
                    <td className="px-6 py-3 text-right flex gap-2 items-center justify-end">
                      <button onClick={e => { e.stopPropagation(); handleToggleStar(doc.name); }} title={doc.starred ? "Unstar" : "Star"}>
                        <Star className={doc.starred ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"} />
                      </button>
                      <button className="text-xs text-red-500 hover:underline" onClick={e => { e.stopPropagation(); handleDeleteDoc(doc.name); }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      {/* Right panel */}
      <aside className="w-80 border-l bg-gray-50 flex flex-col min-h-0 p-6 hidden xl:block">
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="text-2xl font-bold text-gray-800 mb-1">3:45 AM</div>
          <div className="text-gray-500 text-sm mb-2">Thursday, June 26</div>
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <span className="w-2 h-2 bg-blue-400 rounded-full inline-block"></span>
            You haven't connected your calendar yet. <button className="underline" onClick={() => openModal("connectCalendar")}>Connect now</button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="font-semibold text-gray-700 mb-2">Today, Jun 26</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">No meetings scheduled.</span>
            <button className="text-xs text-blue-600 hover:underline" onClick={() => openModal("scheduleMeeting")}>+ Schedule a meeting</button>
          </div>
          <div className="flex items-center justify-center mt-6">
            <Image src="/public/placeholder-logo.svg" alt="No meetings" width={64} height={64} className="opacity-30" />
          </div>
        </div>
        <div className="mt-auto text-xs text-blue-600 underline cursor-pointer" onClick={() => openModal("recordings")}>Open recordings</div>
      </aside>

      {/* Modals */}
      <Modal open={!!modal && modal.type === "newDoc"} onClose={closeModal} title="New Document">
        <input className="w-full border rounded px-3 py-2 mb-4" placeholder="Document name" value={newDocName} onChange={e => setNewDocName(e.target.value)} />
        <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition" onClick={handleAddDoc}>Create</button>
      </Modal>
      <Modal open={!!modal && modal.type === "newFolder"} onClose={closeModal} title="New Shared Folder">
        <input className="w-full border rounded px-3 py-2 mb-4" placeholder="Folder name" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" onClick={handleAddFolder}>Create</button>
      </Modal>
      <Modal open={!!modal && modal.type === "newTable"} onClose={closeModal} title="New Data Table">
        <button
          className="w-full bg-blue-600 text-white py-2 rounded"
          onClick={() => {
            window.open("https://docs.google.com/document/create", "_blank");
            closeModal();
          }}
        >
          Create Table in Google Docs
        </button>
        <p className="mt-2 text-gray-500 text-sm">
          In the new Google Doc, go to <b>Insert &gt; Table</b> to add a table.
        </p>
      </Modal>
      <Modal open={!!modal && modal.type === "fromMeetings"} onClose={closeModal} title="Create from Meetings">
        <div className="mb-4">(Demo) Create docs from meetings coming soon.</div>
        <button className="w-full bg-purple-600 text-white py-2 rounded" onClick={closeModal}>Close</button>
      </Modal>
      <Modal open={!!modal && modal.type === "templates"} onClose={closeModal} title="Templates">
        <div className="mb-4">(Demo) Templates coming soon.</div>
        <button className="w-full bg-purple-600 text-white py-2 rounded" onClick={closeModal}>Close</button>
      </Modal>
      <Modal open={!!modal && modal.type === "import"} onClose={closeModal} title="Import">
        <div className="mb-4">(Demo) Import feature coming soon.</div>
        <button className="w-full bg-purple-600 text-white py-2 rounded" onClick={closeModal}>Close</button>
      </Modal>
      <Modal open={!!modal && modal.type === "agenda"} onClose={closeModal} title="Create Meeting Agenda">
        <div className="mb-4">(Demo) Meeting agenda creation coming soon.</div>
        <button className="w-full bg-purple-600 text-white py-2 rounded" onClick={closeModal}>Close</button>
      </Modal>
      <Modal open={!!modal && modal.type === "viewMore"} onClose={closeModal} title="View More">
        <div className="mb-4">(Demo) More templates and features coming soon.</div>
        <button className="w-full bg-purple-600 text-white py-2 rounded" onClick={closeModal}>Close</button>
      </Modal>
      <Modal open={!!modal && modal.type === "connectCalendar"} onClose={closeModal} title="Connect Calendar">
        <div className="mb-4 flex flex-col items-center">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-700 transition"
            onClick={() => {
              window.open("https://calendar.google.com", "_blank");
            }}
          >
            Connect Google Calendar
          </button>
          <span className="text-gray-500 text-sm mt-2">You'll be redirected to Google Calendar to connect your account.</span>
        </div>
      </Modal>
      <Modal open={!!modal && modal.type === "scheduleMeeting"} onClose={closeModal} title="Schedule Meeting">
        <div className="mb-4">(Demo) Meeting scheduling coming soon.</div>
        <button className="w-full bg-purple-600 text-white py-2 rounded" onClick={closeModal}>Close</button>
      </Modal>
      <Modal open={!!modal && modal.type === "recordings"} onClose={closeModal} title="Recordings">
        <div className="mb-4">(Demo) Recordings list coming soon.</div>
        <button className="w-full bg-purple-600 text-white py-2 rounded" onClick={closeModal}>Close</button>
      </Modal>
      <Modal open={!!previewDoc} onClose={() => setPreviewDoc(null)} title={previewDoc?.name || "Document Preview"}>
        <div className="mb-4">(Demo) Document preview for <b>{previewDoc?.name}</b> by {previewDoc?.creator}.</div>
        <button className="w-full bg-purple-600 text-white py-2 rounded" onClick={() => setPreviewDoc(null)}>Close</button>
      </Modal>
    </div>
  );
} 