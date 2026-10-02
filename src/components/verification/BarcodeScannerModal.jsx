import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Camera, 
  ScanLine, 
  Flashlight, 
  RotateCw, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Upload, 
  Keyboard, 
  Zap, 
  FileText 
} from 'lucide-react';

export default function BarcodeScannerModal({ 
  isOpen, 
  onClose, 
  onScanSuccess, 
  initialBarcode = '' 
}) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'presets' | 'manual'
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [torchOn, setTorchOn] = useState(false);
  const [manualCode, setManualCode] = useState(initialBarcode || '');
  const [scannedFeedback, setScannedFeedback] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Preset diagnostic specimen barcodes for realistic testing
  const presetBarcodes = [
    { code: 'MED-BC-904812', label: 'Lipid & Fasting Specimen Tag (Default)', tube: 'SST Gold + Grey' },
    { code: 'MED-BC-782104', label: 'Complete Hemogram / CBC Tube', tube: 'EDTA Lavender Vial' },
    { code: 'MED-LAB-449102', label: 'HbA1c & Fasting Glucose Kit', tube: 'Fluoride Vial' },
    { code: 'MED-BC-661920', label: 'Thyroid & Electrolyte Panel', tube: 'Gel Clot Tube' }
  ];

  // Synthesize pleasant checkout scan beep sound via Web Audio API
  const playScanBeep = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1); // A6 chirp

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);

      if (navigator.vibrate) {
        navigator.vibrate([60, 30, 60]);
      }
    } catch (e) {
      // Audio autoplay policy or not supported
    }
  };

  // Complete successful scan
  const handleBarcodeDetected = (code) => {
    if (!code || isProcessing) return;
    setIsProcessing(true);
    playScanBeep();
    setScannedFeedback(code);

    setTimeout(() => {
      onScanSuccess(code);
      setIsProcessing(false);
      onClose();
    }, 700);
  };

  // Start live camera stream
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by your browser environment.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
        setCameraActive(true);
      }

      // Check if native BarcodeDetector API is supported
      if ('BarcodeDetector' in window) {
        try {
          const barcodeDetector = new window.BarcodeDetector({
            formats: ['code_128', 'code_39', 'ean_13', 'ean_8', 'qr_code', 'upc_a']
          });

          scanIntervalRef.current = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === 4 && !isProcessing) {
              try {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes && barcodes.length > 0) {
                  const rawValue = barcodes[0].rawValue;
                  if (rawValue) {
                    clearInterval(scanIntervalRef.current);
                    handleBarcodeDetected(rawValue);
                  }
                }
              } catch (err) {
                // frame detection pass error ignored
              }
            }
          }, 350);
        } catch (e) {
          // BarcodeDetector format error fallback
        }
      }
    } catch (err) {
      console.warn('Camera error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera permissions in browser settings or use Quick Simulation / Manual Entry below.'
          : 'Unable to start camera stream. You can use Quick Simulation, File Upload, or Manual Entry.'
      );
      setCameraActive(false);
    }
  };

  // Stop camera stream tracks
  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setTorchOn(false);
  };

  // Toggle flashlight / torch if supported
  const toggleTorch = async () => {
    if (!mediaStreamRef.current) return;
    const track = mediaStreamRef.current.getVideoTracks()[0];
    if (track) {
      const capabilities = track.getCapabilities?.();
      if (capabilities?.torch) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !torchOn }]
          });
          setTorchOn(!torchOn);
        } catch (e) {
          console.warn('Torch constraint error', e);
        }
      } else {
        setTorchOn(!torchOn);
      }
    }
  };

  // Flip camera rear/front
  const flipCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Process file upload barcode image
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate scanning from uploaded vial photo or detect if API available
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const img = new Image();
      img.onload = async () => {
        if ('BarcodeDetector' in window) {
          try {
            const barcodeDetector = new window.BarcodeDetector({
              formats: ['code_128', 'code_39', 'ean_13', 'qr_code']
            });
            const barcodes = await barcodeDetector.detect(img);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              handleBarcodeDetected(barcodes[0].rawValue);
              return;
            }
          } catch (err) {}
        }
        // Fallback simulation based on file or default specimen tag
        handleBarcodeDetected(`MED-BC-${Math.floor(100000 + Math.random() * 900000)}`);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Handle modal open/close lifecycle
  useEffect(() => {
    if (isOpen) {
      setScannedFeedback(null);
      setIsProcessing(false);
      if (activeTab === 'camera') {
        startCamera();
      }
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, facingMode]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 15, 30, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopCamera();
          onClose();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#0F172A',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          color: '#FFFFFF'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            background: 'linear-gradient(90deg, #002244 0%, #004D40 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(0, 168, 150, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00E5BC'
              }}
            >
              <ScanLine size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                Specimen Barcode Scanner
              </h3>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>
                Scan diagnostic vacutainer vial or pouch tag
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#CBD5E1',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            background: '#1E293B',
            padding: '4px',
            gap: '4px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            style={{
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '11.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'camera' ? '#00A896' : 'transparent',
              color: activeTab === 'camera' ? '#FFFFFF' : '#94A3B8',
              transition: 'all 0.2s'
            }}
          >
            <Camera size={14} />
            <span>Live Scan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('presets');
            }}
            style={{
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '11.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'presets' ? '#00A896' : 'transparent',
              color: activeTab === 'presets' ? '#FFFFFF' : '#94A3B8',
              transition: 'all 0.2s'
            }}
          >
            <Zap size={14} />
            <span>Presets</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('manual');
            }}
            style={{
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '11.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'manual' ? '#00A896' : 'transparent',
              color: activeTab === 'manual' ? '#FFFFFF' : '#94A3B8',
              transition: 'all 0.2s'
            }}
          >
            <Keyboard size={14} />
            <span>Manual</span>
          </button>
        </div>

        {/* Tab 1: Live Camera Scan View */}
        {activeTab === 'camera' && (
          <div style={{ position: 'relative', background: '#000000', minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
            {/* Viewfinder Window */}
            <div
              style={{
                position: 'relative',
                height: '280px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Live Video */}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: cameraActive ? 'block' : 'none'
                }}
              />

              {/* Camera Fallback / Inactive State */}
              {!cameraActive && (
                <div
                  style={{
                    padding: '24px 20px',
                    textAlign: 'center',
                    background: 'radial-gradient(circle, #1E293B 0%, #0F172A 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'rgba(0, 168, 150, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px',
                      color: '#00E5BC'
                    }}
                  >
                    <ScanLine size={28} />
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '6px', color: '#F8FAFC' }}>
                    Scanner Viewfinder Ready
                  </h4>
                  <p style={{ fontSize: '11.5px', color: '#94A3B8', maxWidth: '300px', lineHeight: 1.4, margin: '0 0 16px 0' }}>
                    {cameraError || 'Point camera towards the specimen label barcode or trigger test scan.'}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleBarcodeDetected('MED-BC-904812')}
                      style={{
                        background: 'linear-gradient(135deg, #00A896 0%, #008779 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(0, 168, 150, 0.35)'
                      }}
                    >
                      <Sparkles size={14} />
                      <span>Simulate Barcode Scan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#E2E8F0',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Upload size={14} />
                      <span>Upload Photo</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              )}

              {/* High-Tech Barcode Reticle & Laser Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Viewfinder Target Box */}
                <div
                  style={{
                    width: '260px',
                    height: '140px',
                    position: 'relative',
                    borderRadius: '12px',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {/* Corner Brackets */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderTop: '3px solid #00E5BC', borderLeft: '3px solid #00E5BC', borderTopLeftRadius: '8px' }} />
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderTop: '3px solid #00E5BC', borderRight: '3px solid #00E5BC', borderTopRightRadius: '8px' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderBottom: '3px solid #00E5BC', borderLeft: '3px solid #00E5BC', borderBottomLeftRadius: '8px' }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderBottom: '3px solid #00E5BC', borderRight: '3px solid #00E5BC', borderBottomRightRadius: '8px' }} />

                  {/* Animated Sweeping Laser Line */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '6px',
                      right: '6px',
                      height: '3px',
                      background: 'linear-gradient(90deg, transparent, #00E5BC, #FFFFFF, #00E5BC, transparent)',
                      boxShadow: '0 0 12px 2px #00E5BC',
                      animation: 'scanLaser 2s infinite ease-in-out'
                    }}
                  />

                  {/* Center Aim Marker */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '11px',
                      fontWeight: '700',
                      letterSpacing: '0.08em',
                      color: 'rgba(255, 255, 255, 0.65)',
                      textTransform: 'uppercase',
                      textAlign: 'center'
                    }}
                  >
                    Align Barcode Here
                  </div>
                </div>
              </div>

              {/* Scanned Success Flash Overlay */}
              {scannedFeedback && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 168, 150, 0.85)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20,
                    animation: 'fadeIn 0.2s ease-out'
                  }}
                >
                  <CheckCircle2 size={48} color="#FFFFFF" />
                  <div style={{ fontSize: '18px', fontWeight: '800', marginTop: '10px' }}>
                    Barcode Scanned!
                  </div>
                  <div
                    style={{
                      marginTop: '6px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      fontWeight: '700'
                    }}
                  >
                    {scannedFeedback}
                  </div>
                </div>
              )}
            </div>

            {/* Camera Bottom Controls */}
            <div
              style={{
                padding: '12px 16px',
                background: '#0F172A',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={toggleTorch}
                  title="Toggle Torch/Flashlight"
                  style={{
                    background: torchOn ? '#00A896' : 'rgba(255, 255, 255, 0.1)',
                    color: torchOn ? '#FFFFFF' : '#CBD5E1',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Flashlight size={15} />
                  <span>{torchOn ? 'Torch On' : 'Torch'}</span>
                </button>

                <button
                  type="button"
                  onClick={flipCamera}
                  title="Switch Camera Direction"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#CBD5E1',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RotateCw size={15} />
                  <span>Flip</span>
                </button>
              </div>

              {/* Instant Scan Simulator Trigger */}
              <button
                type="button"
                onClick={() => handleBarcodeDetected('MED-BC-904812')}
                style={{
                  background: 'linear-gradient(135deg, #00A896 0%, #008779 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(0, 168, 150, 0.4)'
                }}
              >
                <Zap size={14} />
                <span>Simulate Scan</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Specimen Barcode Presets */}
        {activeTab === 'presets' && (
          <div style={{ padding: '20px', background: '#0F172A', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
              Select a standard lab vacutainer barcode tag to verify collection instantly:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {presetBarcodes.map((item) => (
                <div
                  key={item.code}
                  onClick={() => handleBarcodeDetected(item.code)}
                  style={{
                    background: '#1E293B',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    hover: { background: '#25354C' }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: 'rgba(0, 168, 150, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00E5BC'
                      }}
                    >
                      <ScanLine size={16} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '13px', color: '#F8FAFC' }}>
                        {item.code}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                        {item.label} • <span style={{ color: '#00E5BC' }}>{item.tube}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      background: 'rgba(0, 168, 150, 0.2)',
                      color: '#00E5BC',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700'
                    }}
                  >
                    Select ➔
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Manual Input Fallback */}
        {activeTab === 'manual' && (
          <div style={{ padding: '20px', background: '#0F172A', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
              If barcode is physically damaged, enter the printed alphanumeric tag manually:
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                Specimen Barcode Tag Number
              </label>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="e.g. MED-BC-904812"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: '#1E293B',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.05em'
                }}
              />
            </div>

            <button
              type="button"
              disabled={!manualCode.trim()}
              onClick={() => handleBarcodeDetected(manualCode.trim())}
              style={{
                background: manualCode.trim() ? 'linear-gradient(135deg, #00A896 0%, #008779 100%)' : '#334155',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: manualCode.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: manualCode.trim() ? '0 4px 12px rgba(0, 168, 150, 0.35)' : 'none'
              }}
            >
              <CheckCircle2 size={16} />
              <span>Apply Barcode Tag</span>
            </button>
          </div>
        )}

        {/* Footer info banner */}
        <div
          style={{
            padding: '10px 16px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#64748B'
          }}
        >
          <span>NABL Accredited Diagnostic Specimen Chain</span>
          <span>MediUnify Protocol v2.4</span>
        </div>
      </div>

      <style>{`
        @keyframes scanLaser {
          0% { top: 4px; opacity: 0.8; }
          50% { top: calc(100% - 7px); opacity: 1; }
          100% { top: 4px; opacity: 0.8; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
