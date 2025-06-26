"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Blockquote from "@tiptap/extension-blockquote";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { lowlight } from 'lowlight';
import { ArrowLeft, Star, Cloud, User, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DocEditor({ id }: { id: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("Untitled");
  const [isStarred, setIsStarred] = useState(false);
  const [lastSaved, setLastSaved] = useState("");

  // Load/save doc content from localStorage for demo
  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem(`doc-${id}`);
    if (saved) {
      const { title, content, lastSaved } = JSON.parse(saved);
      setTitle(title || "Untitled");
      setLastSaved(lastSaved || "");
      editor?.commands.setContent(content || "");
    }
    // eslint-disable-next-line
  }, [id]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Try "/" to insert or press "space" to start AI Companion.'
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Image,
      CodeBlockLowlight.configure({ lowlight }),
      Blockquote,
      Underline,
      Highlight,
      Link,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      HorizontalRule,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSaved(now);
      if (id) {
        localStorage.setItem(
          `doc-${id}`,
          JSON.stringify({ title, content: editor.getHTML(), lastSaved: now })
        );
      }
    },
  });

  // Save title changes
  useEffect(() => {
    if (id && editor) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSaved(now);
      localStorage.setItem(
        `doc-${id}`,
        JSON.stringify({ title, content: editor.getHTML(), lastSaved: now })
      );
    }
    // eslint-disable-next-line
  }, [title]);

  // Add image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor?.chain().focus().setImage({ src: reader.result as string }).run();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Topbar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b bg-white sticky top-0 z-20">
        <button onClick={() => router.back()} className="p-2 rounded hover:bg-gray-100"><ArrowLeft /></button>
        <div className="flex items-center gap-2">
          <input
            className="font-bold text-xl bg-transparent outline-none border-none px-2 py-1 rounded hover:bg-gray-50 focus:bg-gray-50 transition"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Untitled"
            style={{ minWidth: 120, maxWidth: 320 }}
          />
          <button onClick={() => setIsStarred(s => !s)} className={isStarred ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"}><Star /></button>
          <Cloud className="ml-2 w-5 h-5 text-blue-400" title="Saved" />
        </div>
        {/* Toolbar (basic for demo) */}
        <div className="flex-1 flex items-center gap-2 ml-6">
          <button onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? "font-bold text-purple-600" : "text-gray-500 hover:text-purple-600"}>B</button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? "italic text-purple-600" : "text-gray-500 hover:text-purple-600"}>I</button>
          <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? "text-purple-600" : "text-gray-500 hover:text-purple-600"}>• List</button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={editor?.isActive('heading', { level: 1 }) ? "text-purple-600" : "text-gray-500 hover:text-purple-600"}>H1</button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading', { level: 2 }) ? "text-purple-600" : "text-gray-500 hover:text-purple-600"}>H2</button>
          <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className={editor?.isActive('underline') ? "underline text-purple-600" : "text-gray-500 hover:text-purple-600"}>U</button>
          <button onClick={() => editor?.chain().focus().toggleHighlight().run()} className={editor?.isActive('highlight') ? "bg-yellow-200 text-purple-600" : "text-gray-500 hover:text-purple-600"}>HL</button>
          <button onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={editor?.isActive('blockquote') ? "text-purple-600" : "text-gray-500 hover:text-purple-600"}>&ldquo;Blockquote&rdquo;</button>
          <button onClick={() => editor?.chain().focus().setHorizontalRule().run()} className="text-gray-500 hover:text-purple-600">HR</button>
          <button onClick={() => editor?.chain().focus().toggleCodeBlock().run()} className={editor?.isActive('codeBlock') ? "text-purple-600" : "text-gray-500 hover:text-purple-600"}>Code</button>
          <button onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="text-gray-500 hover:text-purple-600">Table</button>
          <label className="cursor-pointer text-gray-500 hover:text-purple-600">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            🖼️
          </label>
          <button onClick={() => editor?.chain().focus().setTextAlign('left').run()} className="text-gray-500 hover:text-purple-600">Left</button>
          <button onClick={() => editor?.chain().focus().setTextAlign('center').run()} className="text-gray-500 hover:text-purple-600">Center</button>
          <button onClick={() => editor?.chain().focus().setTextAlign('right').run()} className="text-gray-500 hover:text-purple-600">Right</button>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button className="flex items-center gap-1 px-3 py-1 rounded bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100"><Share2 className="w-4 h-4" /> Share</button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500">
            <User className="text-white w-5 h-5" />
          </div>
        </div>
      </div>
      {/* Document meta */}
      <div className="flex items-center gap-4 px-8 py-4 text-gray-500 text-sm border-b bg-white">
        <span><b>Uwem Precious</b></span>
        <span>Updated at {lastSaved || "-"}</span>
        <span>1 <span className="ml-1">👁️</span></span>
        <span>1 min</span>
      </div>
      {/* Editor area */}
      <div className="flex-1 flex flex-col items-center px-2 py-8 bg-white">
        <div className="w-full max-w-3xl">
          <EditorContent editor={editor} className="prose prose-lg focus:outline-none min-h-[400px]" />
        </div>
        <div className="mt-8 w-full max-w-3xl text-gray-500 text-base space-y-2">
          <div className="text-blue-600 font-medium cursor-pointer hover:underline">Start writing with AI Companion</div>
          <div className="flex items-center gap-2"><span className="text-lg">👥</span> Kick off with templates</div>
          <div className="flex items-center gap-2"><span className="text-lg">🗂️</span> Build a data table for tasks & projects</div>
        </div>
      </div>
    </div>
  );
} 