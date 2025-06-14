'use client'

import FileTopbar from '@/components/files/FileTopbar'
import DrawingCanvas from '@/components/files/DrawingCanvas'
import { useEditorStore } from '@/lib/store/editorStore'
import AudioPlayer from '@/components/files/AudioPlayer'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function EditorLayout() {
  const { bgColor, imageSrc, audioURL, checklist, dataTable, insertDataTable } = useEditorStore();
  const [showCanvas, setShowCanvas] = useState(false);
  const searchParams = useSearchParams();

  // Check query param for table insertion
  useEffect(() => {
    if (searchParams.get('insert') === 'table' && !dataTable) {
      insertDataTable()
    }
  }, [searchParams, insertDataTable, dataTable]);

  return (
    <div className={`px-6 py-4 min-h-screen transition-colors ${bgColor}`}>
      <FileTopbar setShowCanvas={setShowCanvas} />

      {showCanvas && <DrawingCanvas />}

      {imageSrc && (
        <img 
          src={imageSrc} 
          alt="Uploaded" 
          className="max-w-[700px] max-h-[500px] w-full h-auto rounded-xl shadow my-4 mx-auto object-contain" 
        />
      )}

      {audioURL && (
        <div className="my-4">
          <h4 className="font-semibold text-purple-600 mb-2">Audio Note:</h4>
          <AudioPlayer src={audioURL} />
        </div>
      )}

      {checklist.length > 0 && (
        <div className="my-4">
          <h4 className="font-semibold mb-2">Checklist:</h4>
          {checklist.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input type="checkbox" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {dataTable && (
  <div className="my-4 bg-white rounded-lg shadow border p-4">
    {/* Top Toolbar */}
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <div className="border rounded px-2 py-1 text-sm flex items-center gap-1">
          <span className="text-gray-500">🔎</span>
          <input
            type="text"
            placeholder="Search..."
            className="outline-none text-sm bg-transparent placeholder-gray-400"
          />
        </div>
      </div>
      <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm">+</button>
    </div>

    {/* Table Header */}
    <div className="flex bg-gray-100 px-4 py-2 border-b font-semibold text-sm text-gray-600 rounded-t">
      <div className="w-1/6">#</div>
      <div className="w-1/3">Name</div>
      <div className="w-1/3">Tags</div>
    </div>

    {/* Table Rows */}
    {dataTable.map((row, index) => (
      <div key={row.id} className="flex px-4 py-2 border-b text-sm items-center">
        <div className="w-1/6">{index + 1}</div>
        <div className="w-1/3">
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            defaultValue={row.name}
          />
        </div>
        <div className="w-1/3">
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            defaultValue={row.tags}
          />
        </div>
      </div>
    ))}

    {/* Add Row Button */}
    <div className="flex justify-center mt-3">
      <button className="border rounded px-4 py-2 text-sm text-purple-600 hover:bg-purple-50">
        + Add Row
      </button>
    </div>
  </div>
)}

    </div>
  )
}
