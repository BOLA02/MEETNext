import { create } from 'zustand'

interface EditorState {
  bgColor: string
  imageSrc: string | null
  checklist: string[]
  audioURL: string | null

  setBgColor: (color: string) => void
  setImageSrc: (src: string) => void
  addChecklistItem: (item: string) => void
  setAudioURL: (url: string) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  bgColor: 'bg-white',
  imageSrc: null,
  checklist: [],
  audioURL: null,

  setBgColor: (color) => set({ bgColor: color }),
  setImageSrc: (src) => set({ imageSrc: src }),
  addChecklistItem: (item) => set((state) => ({ checklist: [...state.checklist, item] })),
  setAudioURL: (url) => set({ audioURL: url }),
}))
