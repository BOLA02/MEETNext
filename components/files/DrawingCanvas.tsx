import React, { useRef, useState, useEffect } from 'react';
import { Undo2, Redo2, Trash2, Download, Pen, Eraser, Palette, StickyNote, Square, Circle, Type, X, Minus } from 'lucide-react';

const COLORS = ['#000000', '#EF4444', '#F59E42', '#059669', '#2563EB', '#7C3AED', '#FFFFFF'];
const SIZES = [2, 4, 8, 12, 16];

const TOOLS = {
  PEN: 'pen',
  ERASER: 'eraser',
  NOTE: 'note',
  RECT: 'rect',
  ELLIPSE: 'ellipse',
  LINE: 'line',
  TEXT: 'text',
};

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;

function getRelativeCoords(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  // Use clientX/Y for pointer events and adjust for canvas position
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

export default function DrawingCanvas({ onClose }) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState(TOOLS.PEN);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [elements, setElements] = useState([]); // Unified state for notes, shapes, text
  const [editingText, setEditingText] = useState(null); // { x, y, text }

  const drawElements = (ctx) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    elements.forEach(el => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (el.type === 'path') {
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.size;
        ctx.beginPath();
        el.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
      } else if (el.type === TOOLS.RECT) {
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.size;
        ctx.strokeRect(el.x, el.y, el.width, el.height);
      } else if (el.type === TOOLS.ELLIPSE) {
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.size;
        ctx.beginPath();
        ctx.ellipse(el.x + el.width / 2, el.y + el.height / 2, Math.abs(el.width / 2), Math.abs(el.height / 2), 0, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (el.type === TOOLS.TEXT) {
        ctx.fillStyle = el.color;
        ctx.font = `${el.size * 5}px sans-serif`;
        ctx.textBaseline = 'top';
        ctx.fillText(el.text, el.x, el.y);
      }
    });
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    drawElements(ctx);
  }, [elements]);


  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = getRelativeCoords(e, canvas);
    
    // If we are editing text and click outside, commit it first.
    if (editingText) {
      handleTextCommit();
      return;
    }

    if (tool === TOOLS.TEXT) {
      // Start editing text at the clicked position
      setEditingText({ x, y, text: '' });
      setIsDrawing(false); // Don't create other elements while typing
      return;
    }

    setIsDrawing(true);
    setRedoStack([]);

    const newElement = {
      id: Date.now(),
      type: tool,
      x, y,
      color,
      size,
    };

    if (tool === TOOLS.PEN || tool === TOOLS.ERASER) {
      newElement.points = [{ x, y }];
      newElement.type = 'path';
      if(tool === TOOLS.ERASER) newElement.color = '#FFFFFF';
    } else if ([TOOLS.RECT, TOOLS.ELLIPSE].includes(tool)) {
      newElement.width = 0;
      newElement.height = 0;
    }

    setElements(prev => [...prev, newElement]);
  };
  
  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    const { x, y } = getRelativeCoords(e, canvasRef.current);
    
    setElements(prev => prev.map(el => {
      if (el.id === elements[elements.length - 1].id) {
        if (el.type === 'path') {
          el.points.push({ x, y });
        } else if ([TOOLS.RECT, TOOLS.ELLIPSE].includes(el.type)) {
          el.width = x - el.x;
          el.height = y - el.y;
        }
      }
      return el;
    }));
  };
  
  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handleTextChange = (e) => {
    if (!editingText) return;
    setEditingText({ ...editingText, text: e.target.value });
  };

  const handleTextCommit = () => {
    if (!editingText || !editingText.text.trim()) {
      setEditingText(null);
      return;
    }
    const newTextElement = {
      id: Date.now(),
      type: TOOLS.TEXT,
      x: editingText.x,
      y: editingText.y,
      text: editingText.text,
      color,
      size,
    };
    setElements(prev => [...prev, newTextElement]);
    setEditingText(null);
  };

  const handleUndo = () => {
    if (elements.length === 0) return;
    const lastElement = elements[elements.length - 1];
    setRedoStack(prev => [lastElement, ...prev]);
    setElements(prev => prev.slice(0, -1));
  };
  
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextElement = redoStack[0];
    setElements(prev => [...prev, nextElement]);
    setRedoStack(prev => prev.slice(1));
  };

  const handleClear = () => {
    setElements([]);
    setHistory([]);
    setRedoStack([]);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Redraw with white background for export
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'whiteboard.png';
    link.click();

    // Redraw without background
    drawElements(ctx);
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div 
        className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-2 right-2 z-30 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black"
            title="Close Canvas"
        >
            <X className="w-5 h-5" />
        </button>

        {/* Top Options Toolbar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-b-xl shadow-md px-4 py-2 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Color:</span>
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)} className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-purple-600 ring-2 ring-purple-300' : 'border-gray-300'}`} style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Size:</span>
            <input 
              type="range" 
              min={SIZES[0]} 
              max={SIZES[SIZES.length-1]} 
              step="1" 
              value={size} 
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-24"
            />
          </div>
          <div className="border-l pl-4 flex items-center gap-2">
            <button onClick={handleUndo} className="p-2 rounded-full hover:bg-gray-200" title="Undo"><Undo2 className="w-5 h-5" /></button>
            <button onClick={handleRedo} className="p-2 rounded-full hover:bg-gray-200" title="Redo"><Redo2 className="w-5 h-5" /></button>
            <button onClick={handleClear} className="p-2 rounded-full hover:bg-gray-200" title="Clear Canvas"><Trash2 className="w-5 h-5" /></button>
            <button onClick={handleExport} className="p-2 rounded-full hover:bg-gray-200" title="Download as PNG"><Download className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Left Tools Toolbar */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20 bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-2 flex flex-col items-center gap-2">
          {Object.values(TOOLS).map(t => {
            const icons = { pen: Pen, eraser: Eraser, note: StickyNote, rect: Square, ellipse: Circle, line: Minus, text: Type };
            const Icon = icons[t];
            if (!Icon) return null;
            return (
              <button key={t} onClick={() => setTool(t)} className={`p-3 rounded-lg ${tool === t ? 'bg-purple-600 text-white' : 'hover:bg-gray-200'}`} title={t.charAt(0).toUpperCase() + t.slice(1)}>
                <Icon className="w-6 h-6" />
              </button>
            )
          })}
        </div>
        
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="cursor-crosshair"
          onPointerDown={handlePointerDown}
        />

        {editingText && (
          <textarea
            value={editingText.text}
            onChange={handleTextChange}
            onBlur={handleTextCommit}
            autoFocus
            style={{
              position: 'absolute',
              left: editingText.x - 2,
              top: editingText.y - 2,
              border: '1px dashed #7C3AED',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.9)',
              fontFamily: 'sans-serif',
              fontSize: `${size * 5}px`,
              lineHeight: 1.1,
              color: color,
              padding: '2px',
              zIndex: 100,
              minWidth: '100px',
              minHeight: `${size * 5 + 4}px`,
              resize: 'none',
              overflow: 'hidden',
              whiteSpace: 'pre',
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTextCommit();
                }
            }}
          />
        )}
      </div>
    </div>
  );
}
