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
      { id: 1, name: '', tags: '' },
      { id: 2, name: '', tags: '' },
      { id: 3, name: '', tags: '' },
      { id: 4, name: '', tags: '' },
    ]
  }),
  reset: () => set({
    bgColor: 'bg-white',
    imageSrc: null,
    checklist: [],
    audioURL: null,
    dataTable: null,
  }),
}))
