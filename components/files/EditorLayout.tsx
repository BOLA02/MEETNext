'use client'

import FileTopbar from '@/components/files/FileTopbar'
import DrawingCanvas from '@/components/files/DrawingCanvas'
import { useEditorStore } from '@/lib/store/editorStore'
import AudioPlayer from '@/components/files/AudioPlayer'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export default function EditorLayout() {
  const { 
    bgColor, 
    imageSrc, 
    audioURL, 
    checklist, 
    dataTable, 
    insertDataTable,
    addRow,
    updateCell,
  } = useEditorStore();
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
              <div className="border rounded px-2 py-1 text-sm flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="outline-none text-sm bg-transparent placeholder-gray-400"
                />
              </div>
            </div>
            <button onClick={addRow} className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-purple-700">
              + Add
            </button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[50px_1fr_1fr] bg-gray-50 px-4 py-2 border-b font-semibold text-sm text-gray-600 rounded-t">
            <div>#</div>
            <div>Name</div>
            <div>Tags</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y">
            {dataTable.map((row, rowIndex) => (
              <div key={row.id} className="grid grid-cols-[50px_1fr_1fr] px-4 py-1 items-center hover:bg-gray-50">
                <div className="text-gray-500">{rowIndex + 1}</div>
                <div>
                  <input
                    className="w-full bg-transparent p-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 rounded"
                    value={row.name}
                    onChange={(e) => updateCell(rowIndex, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <input
                    className="w-full bg-transparent p-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 rounded"
                    value={row.tags}
                    onChange={(e) => updateCell(rowIndex, 'tags', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Row Button */}
          <div className="flex justify-start mt-3">
            <button onClick={addRow} className="border rounded px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 flex items-center gap-2 font-medium">
              <span className="text-lg">+</span> Add Row
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
