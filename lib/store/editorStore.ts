import { create } from 'zustand'

interface DataTableRow {
  id: number
  name: string
  tags: string
}

interface EditorState {
  bgColor: string
  imageSrc: string | null
  checklist: string[]
  audioURL: string | null
  dataTable: DataTableRow[] | null

  setBgColor: (color: string) => void
  setImageSrc: (src: string) => void
  addChecklistItem: (item: string) => void
  setAudioURL: (url: string) => void
  insertDataTable: () => void
  addRow: () => void
  updateCell: (rowIndex: number, columnId: string, value: string) => void
  reset: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  bgColor: 'bg-white',
  imageSrc: null,
  checklist: [],
  audioURL: null,
  dataTable: null,

  setBgColor: (color) => set({ bgColor: color }),
  setImageSrc: (src) => set({ imageSrc: src }),
  addChecklistItem: (item) => set((state) => ({ checklist: [...state.checklist, item] })),
  setAudioURL: (url) => set({ audioURL: url }),
  insertDataTable: () => set({
    dataTable: [
      { id: 1, name: 'Project Alpha', tags: 'Urgent' },
      { id: 2, name: 'Q2 Financials', tags: 'Finance' },
      { id: 3, name: 'User Research', tags: 'UX' },
    ]
  }),
  addRow: () => set((state) => ({
    dataTable: state.dataTable 
      ? [...state.dataTable, { id: Date.now(), name: '', tags: '' }] 
      : []
  })),
  updateCell: (rowIndex, columnId, value) => set(state => ({
    dataTable: state.dataTable ? state.dataTable.map((row, i) => 
      i === rowIndex ? { ...row, [columnId]: value } : row
    ) : []
  })),
  reset: () => set({
    bgColor: 'bg-white',
    imageSrc: null,
    checklist: [],
    audioURL: null,
    dataTable: null,
  }),
}))
