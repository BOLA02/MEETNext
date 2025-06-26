"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";

export default function ExcelIntegrationPage() {
  const [embedUrl, setEmbedUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [excelData, setExcelData] = useState<any[][]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open Excel Online in new tab
  const handleOpenExcel = () => {
    window.open("https://office.com/launch/excel", "_blank");
  };

  // Embed Excel file from OneDrive/SharePoint
  const handleEmbed = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) setEmbedUrl(inputUrl.trim());
  };

  // Upload Excel file and parse
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setExcelData(json as any[][]);
    };
    reader.readAsArrayBuffer(file);
  };

  // Download current data as Excel
  const handleDownload = () => {
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "export.xlsx");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-2">
      <div className="w-full max-w-3xl space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-blue-100">
          <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Excel Integration</h1>
          <button
            onClick={handleOpenExcel}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-semibold text-lg mb-2"
          >
            Create or Edit in Excel Online
          </button>
          <p className="text-gray-500 text-sm mb-2">
            You'll be redirected to <a href="https://office.com/launch/excel" target="_blank" rel="noopener noreferrer" className="underline text-green-700">Excel Online</a> for the best spreadsheet experience.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 border border-blue-100">
          <form onSubmit={handleEmbed} className="flex flex-col items-center w-full max-w-xl mx-auto mb-4">
            <label className="mb-2 font-semibold text-blue-700">Embed an existing Excel file (OneDrive/SharePoint link):</label>
            <div className="flex w-full gap-2">
              <input
                type="text"
                placeholder="Paste OneDrive/SharePoint embed link here"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow">Embed</button>
            </div>
          </form>
          {embedUrl && (
            <div className="w-full flex flex-col items-center mb-2">
              <iframe
                src={embedUrl}
                width="100%"
                height="600"
                frameBorder="0"
                className="border rounded-lg shadow"
                style={{ maxWidth: 1200 }}
              />
              <p className="mt-2 text-gray-500 text-xs">
                This is an embedded Excel file from OneDrive/SharePoint. Users must have access to view or edit this file.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-8 border border-blue-100 flex flex-col items-center">
          <h2 className="font-bold text-blue-700 mb-2">Upload/Download Excel File</h2>
          <input
            type="file"
            accept=".xlsx,.xls"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="mb-4 border-2 border-blue-200 rounded-lg px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
          {excelData.length > 0 && (
            <>
              <div className="overflow-x-auto w-full mb-2">
                <table className="w-full border rounded-lg text-sm">
                  <tbody>
                    {excelData.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                        {row.map((cell, j) => (
                          <td key={j} className="border px-2 py-1 text-xs text-gray-700">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={handleDownload} className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow">Download as Excel</button>
            </>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow p-8 border border-blue-100 mt-8">
          <h2 className="font-bold text-blue-700 mb-2">Microsoft Graph API Integration (Advanced)</h2>
          <p className="text-gray-600 text-sm mb-2">
            For full programmatic integration (create, list, manage Excel files for users), set up Microsoft OAuth and use the Microsoft Graph API. This requires backend setup and user authentication.
          </p>
          <a
            href="https://learn.microsoft.com/en-us/graph/api/resources/excel?view=graph-rest-1.0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline font-semibold"
          >
            Learn more about the Microsoft Graph Excel API
          </a>
        </div>
      </div>
    </div>
  );
} 