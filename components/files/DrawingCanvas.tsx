import React, { useRef, useState } from 'react';
import { Undo2, Redo2, Trash2, Download, Pen, Eraser, Palette, StickyNote, Square, Circle, Type, X } from 'lucide-react';

const COLORS = ['#000000', '#7C3AED', '#2563EB', '#059669', '#F59E42', '#EF4444', '#FFFFFF'];

const TOOL_PEN = 'pen';
const TOOL_ERASER = 'eraser';
const TOOL_NOTE = 'note';
const TOOL_RECT = 'rect';
const TOOL_ELLIPSE = 'ellipse';
const TOOL_LINE = 'line';
const TOOL_TEXT = 'text';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;

function getRelativeCoords(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
  };
}

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState(TOOL_PEN);
  const [color, setColor] = useState(COLORS[1]);
  const [size, setSize] = useState(4);
  const [drawing, setDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [notes, setNotes] = useState([]); // {id, x, y, text}
  const [dragNoteId, setDragNoteId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [shapeStart, setShapeStart] = useState(null); // {x, y}
  const [shapes, setShapes] = useState([]); // {type, x1, y1, x2, y2, color, size}
  const [textInput, setTextInput] = useState('');
  const [textPos, setTextPos] = useState(null); // {x, y}
  const [editingNoteId, setEditingNoteId] = useState(null);

  // --- Drawing logic ---
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = getRelativeCoords(e, canvas);
    if (tool === TOOL_NOTE) {
      // Add sticky note
      const id = Date.now() + Math.random();
      setNotes((prev) => [...prev, { id, x, y, text: 'Double-click to edit' }]);
      setTool(TOOL_PEN); // Switch back to pen after placing note
      return;
    }
    if (tool === TOOL_TEXT) {
      setTextPos({ x, y });
      setTextInput('');
      return;
    }
    if ([TOOL_RECT, TOOL_ELLIPSE, TOOL_LINE].includes(tool)) {
      setShapeStart({ x, y });
      return;
    }
    // Pen/Eraser
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
    setRedoStack([]);
  };

  const handlePointerMove = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = getRelativeCoords(e, canvas);
    if (tool === TOOL_PEN || tool === TOOL_ERASER) {
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = size;
      ctx.strokeStyle = tool === TOOL_PEN ? color : '#fff';
      ctx.globalCompositeOperation = tool === TOOL_PEN ? 'source-over' : 'destination-out';
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handlePointerUp = (e) => {
    if (!drawing) return setDrawing(false);
    setDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory((prev) => [...prev, canvas.toDataURL()]);
    // For shapes
    if (shapeStart && [TOOL_RECT, TOOL_ELLIPSE, TOOL_LINE].includes(tool)) {
      const { x, y } = getRelativeCoords(e, canvas);
      setShapes((prev) => [
        ...prev,
        {
          type: tool,
          x1: shapeStart.x,
          y1: shapeStart.y,
          x2: x,
          y2: y,
          color,
          size,
        },
      ]);
      setShapeStart(null);
      setTool(TOOL_PEN); // Switch back to pen
    }
  };

  // --- Sticky Notes ---
  const handleNotePointerDown = (e, id) => {
    e.stopPropagation();
    setDragNoteId(id);
    const note = notes.find((n) => n.id === id);
    setDragOffset({ x: e.clientX - note.x, y: e.clientY - note.y });
  };
  const handleNotePointerMove = (e) => {
    if (!dragNoteId) return;
    setNotes((prev) => prev.map((n) => n.id === dragNoteId ? { ...n, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } : n));
  };
  const handleNotePointerUp = () => setDragNoteId(null);
  const handleNoteDoubleClick = (id) => setEditingNoteId(id);
  const handleNoteChange = (e, id) => setNotes((prev) => prev.map((n) => n.id === id ? { ...n, text: e.target.value } : n));
  const handleNoteDelete = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));

  // --- Text Tool ---
  const handleTextInputBlur = () => {
    if (textInput && textPos) {
      setShapes((prev) => [
        ...prev,
        { type: TOOL_TEXT, x: textPos.x, y: textPos.y, text: textInput, color, size },
      ]);
    }
    setTextInput('');
    setTextPos(null);
  };

  // --- Undo/Redo/Clear/Export ---
  const handleUndo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setRedoStack((prev) => [history[history.length - 1], ...prev]);
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    if (newHistory.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    img.src = newHistory[newHistory.length - 1];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const next = redoStack[0];
    setHistory((prev) => [...prev, next]);
    setRedoStack((prev) => prev.slice(1));
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    img.src = next;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setRedoStack([]);
    setNotes([]);
    setShapes([]);
  };
  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'whiteboard.png';
    link.click();
  };

  // --- Draw shapes and text on canvas after render ---
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw from history (last image)
    if (history.length > 0) {
      const img = new window.Image();
      img.src = history[history.length - 1];
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        drawShapesAndText(ctx);
      };
    } else {
      drawShapesAndText(ctx);
    }
    // eslint-disable-next-line
  }, [history, shapes]);

  function drawShapesAndText(ctx) {
    shapes.forEach((shape) => {
      ctx.save();
      ctx.strokeStyle = shape.color;
      ctx.fillStyle = shape.color;
      ctx.lineWidth = shape.size;
      if (shape.type === TOOL_RECT) {
        ctx.strokeRect(shape.x1, shape.y1, shape.x2 - shape.x1, shape.y2 - shape.y1);
      } else if (shape.type === TOOL_ELLIPSE) {
        ctx.beginPath();
        ctx.ellipse(
          (shape.x1 + shape.x2) / 2,
          (shape.y1 + shape.y2) / 2,
          Math.abs(shape.x2 - shape.x1) / 2,
          Math.abs(shape.y2 - shape.y1) / 2,
          0,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      } else if (shape.type === TOOL_LINE) {
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
      } else if (shape.type === TOOL_TEXT) {
        ctx.font = `${shape.size * 4}px sans-serif`;
        ctx.fillStyle = shape.color;
        ctx.fillText(shape.text, shape.x, shape.y);
      }
      ctx.restore();
    });
  }

  // --- Render ---
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border p-4 select-none">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button className={`p-2 rounded ${tool === TOOL_PEN ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`} onClick={() => setTool(TOOL_PEN)} title="Pen"><Pen /></button>
        <button className={`p-2 rounded ${tool === TOOL_ERASER ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`} onClick={() => setTool(TOOL_ERASER)} title="Eraser"><Eraser /></button>
        <button className={`p-2 rounded ${tool === TOOL_NOTE ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`} onClick={() => setTool(TOOL_NOTE)} title="Sticky Note"><StickyNote /></button>
        <button className={`p-2 rounded ${tool === TOOL_RECT ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`} onClick={() => setTool(TOOL_RECT)} title="Rectangle"><Square /></button>
        <button className={`p-2 rounded ${tool === TOOL_ELLIPSE ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`} onClick={() => setTool(TOOL_ELLIPSE)} title="Ellipse"><Circle /></button>
        <button className={`p-2 rounded ${tool === TOOL_LINE ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-500'}`} onClick={() => setTool(TOOL_LINE)} title="Line"><svg width="20" height="20"><line x1="3" y1="17" x2="17" y2="3" stroke="currentColor" strokeWidth="2" /></svg></button>
        <button className={`p-2 rounded ${tool === TOOL_TEXT ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-500'}`} onClick={() => setTool(TOOL_TEXT)} title="Text"><Type /></button>
        <div className="flex items-center gap-1">
          {COLORS.map((c) => (
            <button key={c} className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-purple-600' : 'border-gray-200'}`} style={{ background: c }} onClick={() => { setColor(c); setTool(TOOL_PEN); }} title={c} />
          ))}
        </div>
        <input type="range" min={2} max={16} value={size} onChange={e => setSize(Number(e.target.value))} className="mx-2 w-24" title="Brush size" />
        <button className="p-2 rounded bg-gray-100 text-gray-500" onClick={handleUndo} title="Undo"><Undo2 /></button>
        <button className="p-2 rounded bg-gray-100 text-gray-500" onClick={handleRedo} title="Redo"><Redo2 /></button>
        <button className="p-2 rounded bg-gray-100 text-gray-500" onClick={handleClear} title="Clear"><Trash2 /></button>
        <button className="p-2 rounded bg-gray-100 text-gray-500" onClick={handleExport} title="Export"><Download /></button>
      </div>
      {/* Canvas + Notes */}
      <div className="border rounded-xl overflow-hidden bg-white shadow relative" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        onPointerMove={handleNotePointerMove}
        onPointerUp={handleNotePointerUp}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block w-full h-[500px] cursor-crosshair touch-none select-none"
          style={{ background: '#fff' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        {/* Sticky Notes */}
        {notes.map((note) => (
          <div
            key={note.id}
            className="absolute"
            style={{ left: note.x, top: note.y, zIndex: 10, minWidth: 120, minHeight: 60 }}
            onPointerDown={e => handleNotePointerDown(e, note.id)}
            onDoubleClick={() => handleNoteDoubleClick(note.id)}
          >
            {editingNoteId === note.id ? (
              <div className="bg-yellow-200 rounded-lg shadow p-2 flex items-start gap-2">
                <textarea
                  className="bg-transparent w-28 h-16 resize-none outline-none text-sm"
                  value={note.text}
                  onChange={e => handleNoteChange(e, note.id)}
                  onBlur={() => setEditingNoteId(null)}
                  autoFocus
                />
                <button className="text-gray-500 hover:text-red-500" onClick={() => handleNoteDelete(note.id)}><X size={16} /></button>
              </div>
            ) : (
              <div className="bg-yellow-200 rounded-lg shadow p-2 text-sm cursor-move min-w-[100px] min-h-[40px]">
                {note.text}
                <button className="absolute top-1 right-1 text-gray-400 hover:text-red-500" onClick={() => handleNoteDelete(note.id)}><X size={14} /></button>
              </div>
            )}
          </div>
        ))}
        {/* Text input overlay */}
        {tool === TOOL_TEXT && textPos && (
          <input
            className="absolute z-20 border rounded px-2 py-1 text-sm"
            style={{ left: textPos.x, top: textPos.y, minWidth: 80 }}
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onBlur={handleTextInputBlur}
            autoFocus
            placeholder="Type..."
          />
        )}
      </div>
    </div>
  );
};

export default DrawingCanvas;
