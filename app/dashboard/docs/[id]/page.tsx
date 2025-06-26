"use client";

import { useState } from "react";

// NOTE: Next.js will require unwrapping params with React.use(params) in a future release.
// For now, direct access (params.id) is the only supported way. Update this when the new API is released.

export default function GoogleDocsIntegrationPage({ params }: { params: { id: string } }) {
  const [embedId, setEmbedId] = useState(params.id || "");
  const [inputId, setInputId] = useState("");

  const handleOpenGoogleDoc = () => {
    window.open("https://docs.google.com/document/create", "_blank");
  };

  const handleEmbed = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputId.trim()) setEmbedId(inputId.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-6">Google Docs Integration</h1>
      {/* Option 1: Open in new tab */}
      <button
        onClick={handleOpenGoogleDoc}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition mb-6"
      >
        Create a New Google Doc (opens in new tab)
      </button>

      {/* Option 2: Embed a Google Doc by ID */}
      <form onSubmit={handleEmbed} className="mb-6 flex flex-col items-center w-full max-w-xl">
        <label className="mb-2 font-medium">Embed an existing Google Doc by ID:</label>
        <div className="flex w-full gap-2">
          <input
            type="text"
            placeholder="Paste Google Doc ID or full URL here"
            value={inputId}
            onChange={e => setInputId(e.target.value)}
            className="flex-1 px-3 py-2 border rounded shadow-sm"
          />
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Embed</button>
        </div>
      </form>
      {embedId && (
        <div className="w-full flex flex-col items-center mb-8">
          <iframe
            src={`https://docs.google.com/document/d/${extractDocId(embedId)}/edit`}
            width="100%"
            height="800"
            allow="autoplay"
            className="border rounded-lg shadow"
            style={{ maxWidth: 1200 }}
          />
          <p className="mt-2 text-gray-500 text-sm">
            This is an embedded Google Doc in <b>edit</b> mode. Users must be logged in and have access to edit this document.
          </p>
        </div>
      )}
      {/* Option 3: Google Drive/Docs API Integration Placeholder */}
      <div className="w-full max-w-xl mt-8 p-4 border rounded bg-gray-50">
        <h2 className="font-semibold mb-2">Google Drive/Docs API Integration (Advanced)</h2>
        <p className="text-gray-600 text-sm mb-2">
          For full programmatic integration (create, list, manage docs for users), set up Google OAuth and use the Google Drive/Docs API. This requires backend setup and user authentication.
        </p>
        <a
          href="https://developers.google.com/docs/api/quickstart/js"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Learn more about the Google Docs API
        </a>
      </div>
    </div>
  );
}

// Helper to extract Doc ID from a full URL or just return the ID
function extractDocId(input: string) {
  // If input is a full URL, extract the ID
  const match = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : input;
} 