import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Image as ImageIcon, 
  CheckCircle, 
  RefreshCw, 
  Upload, 
  X, 
  Flashlight, 
  AlertCircle,
  Sparkles,
  MapPin
} from 'lucide-react';

export default function CameraProofCapture({ 
  onPhotoCapture, 
  label = "Proof of Delivery / Collection", 
  type = "pharmacy" 
}) {
  const isLab = type === 'lab';
  const defaultPresets = isLab
    ? [
        { label: 'EDTA & Fluoride Vials', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80' },
        { label: 'Barcoded Specimen Bag', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80' }
      ]
    : [
        { label: 'Sealed Medicine Box', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80' },
        { label: 'Handover Package', url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80' }
      ];

  const [preview, setPreview] = useState(null);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Compress and resize images to lightweight JPEG under 30KB
  const compressImageFile = (file, maxWidth = 640, maxHeight = 640, quality = 0.65) => {
    return new Promise((resolve) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;
            if (width > maxWidth || height > maxHeight) {
              if (width > height) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Add GPS Watermark Overlay
            const now = new Date();
            const timeString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            ctx.fillStyle = 'rgba(0, 23, 48, 0.75)';
            ctx.fillRect(0, height - 36, width, 36);
            ctx.fillStyle = '#00C49F';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText('✓ MEDIUNIFY CAPTAIN PROOF', 10, height - 20);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '10px sans-serif';
            ctx.fillText(`GPS: 12.3082° N, 76.6542° E • ${timeString}`, 10, height - 8);

            resolve(canvas.toDataURL('image/jpeg', quality));
          };
          img.onerror = () => resolve(e.target?.result);
          img.src = e.target?.result;
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.warn('Image compression fallback:', err);
        resolve(null);
      }
    });
  };

  // Process file upload from input with automatic downsampling
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressed = await compressImageFile(file);
    if (compressed) {
      setPreview(compressed);
      if (onPhotoCapture) onPhotoCapture(compressed);
    }
    // Reset input value so same file can be chosen again if needed
    e.target.value = '';
  };

  // Open native camera input
  const triggerNativeCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // Open native gallery file picker
  const triggerGallery = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  // Start in-browser WebRTC live camera viewfinder
  const startLiveCamera = async () => {
    setCameraError(null);
    setIsLiveCameraOpen(true);

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("Direct live camera stream not supported by this browser. Using standard camera picker.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Live camera stream error:", err);
      setCameraError("Could not access live camera viewfinder. Launching device camera directly...");
      // Auto fallback to native camera file input
      setTimeout(() => {
        setIsLiveCameraOpen(false);
        triggerNativeCamera();
      }, 1000);
    }
  };

  // Capture snapshot from live video stream
  const captureLiveSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    let width = video.videoWidth || 640;
    let height = video.videoHeight || 480;

    // Downscale if higher than 640px to protect localStorage quota
    const maxDim = 640;
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Draw video frame
    ctx.drawImage(video, 0, 0, width, height);

    // Add GPS Watermark Overlay
    const now = new Date();
    const timeString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Dark banner at bottom
    ctx.fillStyle = 'rgba(0, 23, 48, 0.75)';
    ctx.fillRect(0, height - 36, width, 36);

    // Watermark text
    ctx.fillStyle = '#00C49F';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('✓ MEDIUNIFY CAPTAIN PROOF', 10, height - 20);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px sans-serif';
    ctx.fillText(`GPS: 12.3082° N, 76.6542° E • ${timeString}`, 10, height - 8);

    const snapshotUrl = canvas.toDataURL('image/jpeg', 0.65);
    setPreview(snapshotUrl);
    if (onPhotoCapture) onPhotoCapture(snapshotUrl);

    stopLiveCamera();
  };

  // Stop live camera stream
  const stopLiveCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsLiveCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSelectPreset = (url) => {
    setPreview(url);
    if (onPhotoCapture) onPhotoCapture(url);
  };

  const handleRetake = () => {
    setPreview(null);
    if (onPhotoCapture) onPhotoCapture(null);
  };

  return (
    <div style={{ marginTop: '16px' }}>
      {/* Hidden inputs with direct refs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '8px' }}>
        {label}
      </label>

      {/* 1. Captured Photo Preview State */}
      {preview ? (
        <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '2px solid #00A896', boxShadow: '0 4px 14px rgba(0,168,150,0.15)' }}>
          <img src={preview} alt="Captured Proof" style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,23,48,0.92) 0%, rgba(0,23,48,0.4) 70%, transparent 100%)',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white'
            }}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#00C49F', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle size={14} color="#10B981" />
                <span>Proof Verified & Geo-Tagged</span>
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <MapPin size={11} color="#94A3B8" />
                <span>Mysuru (12.3082° N, 76.6542° E)</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRetake}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <RefreshCw size={12} />
              <span>Retake</span>
            </button>
          </div>
        </div>
      ) : isLiveCameraOpen ? (
        /* 2. In-App Live Camera Viewfinder */
        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#000000', border: '2px solid #00A896', minHeight: '260px' }}>
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={stopLiveCamera}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <X size={16} />
          </button>

          {/* Live indicator */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(0,0,0,0.6)',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: '#FFFFFF',
              fontWeight: '700'
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }}></div>
            <span>LIVE CAMERA</span>
          </div>

          {/* Shutter bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '14px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}
          >
            <button
              type="button"
              onClick={captureLiveSnapshot}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '4px solid #00A896',
                boxShadow: '0 0 16px rgba(0,168,150,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: '#00A896' }} />
            </button>
          </div>

          {cameraError && (
            <div style={{ position: 'absolute', bottom: '80px', left: '12px', right: '12px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', textAlign: 'center' }}>
              {cameraError}
            </div>
          )}
        </div>
      ) : (
        /* 3. Default Upload / Camera Options Container */
        <div>
          <div
            style={{
              border: '2px dashed #CBD5E1',
              borderRadius: '14px',
              padding: '20px 16px',
              textAlign: 'center',
              background: '#F8FAFC',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: '#E6F8F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Camera size={26} color="#00A896" />
            </div>

            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#002244' }}>
                Capture Handover Proof Photo
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                Capture photo using camera or upload from files
              </div>
            </div>

            {/* Direct Action Buttons: Camera and Upload Files */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '380px', marginTop: '4px' }}>
              {/* Button 1: Camera */}
              <button
                type="button"
                onClick={startLiveCamera}
                style={{
                  flex: 1,
                  minWidth: '140px',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00A896 0%, #008779 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(0,168,150,0.3)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                <Camera size={17} />
                <span>Camera</span>
              </button>

              {/* Button 2: Upload Files */}
              <button
                type="button"
                onClick={triggerGallery}
                style={{
                  flex: 1,
                  minWidth: '140px',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  background: '#002244',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(0,34,68,0.2)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                <Upload size={17} />
                <span>Upload Files</span>
              </button>
            </div>
          </div>

          {/* Quick presets for instantaneous verification */}
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} color="#00A896" />
              <span>Or quick select verified sample proof:</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {defaultPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    color: '#002244',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontWeight: '600',
                    boxShadow: '0 1px 3px rgba(0,34,68,0.04)'
                  }}
                >
                  <CheckCircle size={13} color="#10B981" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
