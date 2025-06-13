// components/TextEditor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useImperativeHandle, forwardRef } from 'react'

const TextEditor = forwardRef((_, ref) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start writing here...</p>',
  })

  // Expose editor actions
  useImperativeHandle(ref, () => ({
    undo: () => editor?.chain().focus().undo().run(),
    redo: () => editor?.chain().focus().redo().run(),
  }))

  return (
    <div className="prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  )
})

export default TextEditor
