import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Check } from 'lucide-react';

export default function SignaturePad({ onSave, onClear }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#002244';
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (hasSignature && onSave && canvasRef.current) {
      onSave(canvasRef.current.toDataURL());
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    if (onClear) onClear();
  };

  const handleQuickSignDemo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#002244';
    
    // Draw an authentic cursive mock signature curve
    ctx.beginPath();
    ctx.moveTo(50, 70);
    ctx.bezierCurveTo(80, 20, 110, 100, 140, 50);
    ctx.bezierCurveTo(160, 30, 180, 80, 220, 45);
    ctx.bezierCurveTo(240, 40, 260, 60, 300, 55);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(40, 85);
    ctx.lineTo(310, 80);
    ctx.stroke();

    setHasSignature(true);
    if (onSave) {
      onSave(canvas.toDataURL());
    }
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: 'var(--text-heading)' }}>
          <PenTool size={15} color="var(--color-primary-teal)" />
          <span>Patient / Recipient Signature</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={handleQuickSignDemo}
            style={{
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '11.5px',
              fontWeight: '700',
              cursor: 'pointer',
              color: '#334155',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2
            }}
          >
            Sign for Patient (Demo)
          </button>
          <button
            type="button"
            onClick={handleClear}
            style={{
              background: '#FEE2E2',
              border: '1px solid #FECACA',
              borderRadius: '6px',
              padding: '6px 10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: '#DC2626',
              fontSize: '11.5px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              lineHeight: 1.2
            }}
          >
            <RotateCcw size={13} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Signature Canvas Box */}
      <div
        style={{
          border: '2px dashed #CBD5E1',
          borderRadius: 'var(--radius-md)',
          background: '#FAFAFA',
          position: 'relative',
          overflow: 'hidden',
          touchAction: 'none'
        }}
      >
        <canvas
          ref={canvasRef}
          width={350}
          height={120}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ width: '100%', height: '120px', cursor: 'crosshair', display: 'block' }}
        />
        {!hasSignature && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              color: '#94A3B8',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            Sign inside this box (Touch or Mouse)
          </div>
        )}
      </div>

      {hasSignature && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '12px', fontWeight: '600', marginTop: '6px' }}>
          <Check size={14} />
          <span>Digital signature captured</span>
        </div>
      )}
    </div>
  );
}
