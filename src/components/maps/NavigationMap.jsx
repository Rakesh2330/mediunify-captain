import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  MapPin, 
  Phone, 
  CornerUpRight, 
  ArrowUp, 
  ArrowUpRight, 
  ExternalLink, 
  LocateFixed, 
  ShieldCheck, 
  CheckCircle2, 
  Pause, 
  Store, 
  User, 
  Copy, 
  Check 
} from 'lucide-react';

export default function NavigationMap({ task, destinationType = 'patient', onArrival }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const captainMarkerRef = useRef(null);
  const polylineRef = useRef(null);

  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(12); // 0 to 100%
  const [currentSpeed, setCurrentSpeed] = useState(32);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const isPharmacy = task?.type === 'pharmacy';
  const isGoingToPharmacy = destinationType === 'pharmacy';

  const destinationName = isGoingToPharmacy
    ? (task?.pharmacyName || 'Apollo Pharmacy')
    : (task?.patientName || 'Rahul Kumar');

  const destinationAddress = isGoingToPharmacy
    ? (task?.pharmacyAddress || 'Shop 14, Doctors Corner, Kuvempunagar, Mysuru')
    : (task?.patientAddress || task?.deliveryAddress || 'Flat 402, Green Glen Towers, Jayalakshmipuram, Mysuru');

  const contactPhone = isGoingToPharmacy
    ? (task?.pharmacyPhone || '+91 98450 12345')
    : (task?.patientPhone || '+91 94480 87654');

  // Realistic Route Waypoints in Mysuru
  const routeWaypoints = [
    [12.3082, 76.6542], // Start: Saraswathipuram Park
    [12.3060, 76.6515], // Turn onto Vishwamanava Double Rd
    [12.3032, 76.6470], // Doctors Corner Circle
    [12.3015, 76.6435], // Kuvempu Main Rd
    [12.2995, 76.6405], // 7th Cross intersection
    [12.2980, 76.6385]  // Destination: Patient House
  ];

  // Turn maneuvers along route
  const turnInstructions = isGoingToPharmacy ? [
    { at: 0, distance: '180 m', text: 'Turn Right onto Vishwamanava Double Rd', icon: CornerUpRight, sub: 'In 2 mins' },
    { at: 30, distance: '450 m', text: 'At Doctors Corner Circle, take 2nd exit', icon: ArrowUpRight, sub: 'Pharmacy Zone' },
    { at: 65, distance: '220 m', text: 'Turn Left towards Pharmacy Counter', icon: CornerUpRight, sub: 'Approaching' },
    { at: 90, distance: '50 m', text: 'Pharmacy pickup counter is on your left', icon: ArrowUp, sub: destinationName }
  ] : [
    { at: 0, distance: '180 m', text: 'Turn Right onto Vishwamanava Double Rd', icon: CornerUpRight, sub: 'In 2 mins' },
    { at: 30, distance: '450 m', text: 'At Doctors Corner Circle, take 2nd exit', icon: ArrowUpRight, sub: 'Light traffic' },
    { at: 65, distance: '220 m', text: 'Turn Left onto 7th Cross', icon: CornerUpRight, sub: 'Approaching' },
    { at: 90, distance: '50 m', text: 'Doorstep is on your left', icon: ArrowUp, sub: destinationName }
  ];

  const currentManeuver = turnInstructions.reduce((prev, curr) => {
    return progress >= curr.at ? curr : prev;
  }, turnInstructions[0]);

  const getPositionAtProgress = (pct) => {
    const totalSegments = routeWaypoints.length - 1;
    const scaled = (pct / 100) * totalSegments;
    const index = Math.min(Math.floor(scaled), totalSegments - 1);
    const fraction = scaled - index;

    const p1 = routeWaypoints[index];
    const p2 = routeWaypoints[index + 1];

    const lat = p1[0] + (p2[0] - p1[0]) * fraction;
    const lng = p1[1] + (p2[1] - p1[1]) * fraction;
    return [lat, lng];
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const initialPos = getPositionAtProgress(progress);
      const destPos = routeWaypoints[routeWaypoints.length - 1];

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        center: initialPos,
        zoom: 15
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map);

      L.polyline(routeWaypoints, {
        color: '#00A896',
        weight: 8,
        opacity: 0.25,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      const routeLine = L.polyline(routeWaypoints, {
        color: '#00A896',
        weight: 4,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      polylineRef.current = routeLine;

      const destIcon = L.divIcon({
        className: 'custom-dest-pin',
        html: `
          <div style="position:relative; width:34px; height:40px; display:flex; flex-direction:column; align-items:center;">
            <div style="
              width: 30px; height: 30px;
              border-radius: 50% 50% 50% 0;
              background: linear-gradient(135deg, #002244 0%, #003366 100%);
              transform: rotate(-45deg);
              display: flex; align-items: center; justify-content: center;
              box-shadow: 0 3px 10px rgba(0,34,68,0.35);
              border: 2px solid #FFFFFF;
            ">
              <span style="transform: rotate(45deg); color: #00C49F; font-weight: 800; font-size: 13px;">
                ${isGoingToPharmacy ? '💊' : (isPharmacy ? '📦' : '🩸')}
              </span>
            </div>
          </div>
        `,
        iconSize: [34, 40],
        iconAnchor: [17, 36]
      });

      L.marker(destPos, { icon: destIcon })
        .addTo(map)
        .bindPopup(`<b>${destinationName}</b><br><small>${destinationAddress}</small>`);

      const captainIcon = L.divIcon({
        className: 'custom-captain-puck',
        html: `
          <div style="position:relative; width:38px; height:38px; display:flex; align-items:center; justify-content:center;">
            <div style="
              position: absolute;
              width: 36px; height: 36px;
              border-radius: 50%;
              background: rgba(0, 168, 150, 0.25);
              animation: pulse-ring 2s infinite ease-out;
            "></div>
            <div style="
              width: 22px; height: 22px;
              border-radius: 50%;
              background: #00A896;
              border: 2.5px solid #FFFFFF;
              box-shadow: 0 2px 8px rgba(0,168,150,0.5);
              display: flex; align-items: center; justify-content: center;
              position: relative;
              z-index: 2;
            ">
              <div style="
                width: 0; height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-bottom: 7px solid #FFFFFF;
                transform: rotate(45deg);
              "></div>
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const captainMarker = L.marker(initialPos, { icon: captainIcon, zIndexOffset: 1000 }).addTo(map);
      captainMarkerRef.current = captainMarker;

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      map.fitBounds(routeLine.getBounds(), { padding: [35, 35] });

      mapInstanceRef.current = map;
    } catch (err) {
      console.error('Error initializing Leaflet map:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!captainMarkerRef.current || !mapInstanceRef.current) return;
    const currentPos = getPositionAtProgress(progress);
    captainMarkerRef.current.setLatLng(currentPos);

    if (isNavigating) {
      mapInstanceRef.current.panTo(currentPos, { animate: true, duration: 0.5 });
    }
  }, [progress, isNavigating]);

  useEffect(() => {
    let interval = null;
    if (isNavigating && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 98) {
            clearInterval(interval);
            setIsNavigating(false);
            if (onArrival) onArrival();
            return 100;
          }
          return prev + 4;
        });
        setCurrentSpeed(Math.floor(28 + Math.random() * 12));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isNavigating, progress, onArrival]);

  const handleStartNav = () => {
    setIsNavigating(true);
    if (mapInstanceRef.current) {
      const pos = getPositionAtProgress(progress);
      mapInstanceRef.current.setView(pos, 16, { animate: true });
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      const pos = getPositionAtProgress(progress);
      mapInstanceRef.current.setView(pos, 16, { animate: true });
    }
  };

  const handleManualArrive = () => {
    setProgress(100);
    setIsNavigating(false);
    if (onArrival) onArrival();
  };

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(destinationAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const totalDist = parseFloat(task?.distance || '2.4');
  const remainingDist = Math.max(0.1, (totalDist * (1 - progress / 100))).toFixed(1);
  const totalEta = parseInt(task?.eta || '8');
  const remainingEta = Math.max(1, Math.round(totalEta * (1 - progress / 100)));

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationAddress)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', width: '100%', boxSizing: 'border-box' }}>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .leaflet-container {
          font-family: inherit !important;
          z-index: 1 !important;
        }
        .leaflet-bar {
          border: none !important;
          box-shadow: 0 2px 8px rgba(0,34,68,0.12) !important;
          border-radius: 6px !important;
          overflow: hidden !important;
        }
        .leaflet-bar a {
          width: 28px !important;
          height: 28px !important;
          line-height: 28px !important;
          font-size: 13px !important;
          background-color: #FFFFFF !important;
          color: #002244 !important;
          border-bottom: 1px solid #E2E8F0 !important;
        }
      `}</style>

      {/* 1. TOP TURN HUD */}
      <div
        style={{
          background: 'linear-gradient(135deg, #001730 0%, #002244 100%)',
          borderRadius: '12px',
          padding: '10px 14px',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 14px rgba(0, 34, 68, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00A896 0%, #00C49F 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 168, 150, 0.35)',
              flexShrink: 0
            }}
          >
            {React.createElement(currentManeuver.icon, { size: 18, color: '#FFFFFF' })}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1px' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', color: '#00C49F', textTransform: 'uppercase' }}>
                IN {currentManeuver.distance}
              </span>
              <span style={{ fontSize: '10px', color: '#94A3B8' }}>• {currentManeuver.sub}</span>
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentManeuver.text}
            </div>
          </div>
        </div>

        {/* Speedometer */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '4px 8px',
            textAlign: 'center',
            marginLeft: '8px',
            flexShrink: 0
          }}
        >
          <div style={{ fontSize: '15px', fontWeight: '800', color: isNavigating ? '#00C49F' : '#CBD5E1', lineHeight: 1 }}>
            {isNavigating ? currentSpeed : '0'}
          </div>
          <div style={{ fontSize: '7.5px', fontWeight: '700', color: '#94A3B8', marginTop: '1px' }}>
            KM/H
          </div>
        </div>
      </div>

      {/* 2. MAP CONTAINER */}
      <div
        style={{
          position: 'relative',
          height: '270px',
          width: '100%',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0, 34, 68, 0.08)',
          border: '1px solid #E2E8F0',
          backgroundColor: '#F8FAFC',
          isolation: 'isolate',
          zIndex: 1
        }}
      >
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Live GPS & Traffic Chips */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 500, display: 'flex', gap: '5px' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '3px 8px',
              borderRadius: '14px',
              fontSize: '10px',
              fontWeight: '700',
              color: '#002244',
              boxShadow: '0 1px 4px rgba(0, 34, 68, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span>GPS Active</span>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '3px 8px',
              borderRadius: '14px',
              fontSize: '10px',
              fontWeight: '700',
              color: '#059669',
              boxShadow: '0 1px 4px rgba(0, 34, 68, 0.08)',
              whiteSpace: 'nowrap'
            }}
          >
            🟢 Clear
          </div>
        </div>

        {/* Floating Actions (Recenter & Google Maps) */}
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 500, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={handleRecenter}
            title="Recenter"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 4px rgba(0, 34, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#002244'
            }}
          >
            <LocateFixed size={14} color="#00A896" />
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Maps"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 4px rgba(0, 34, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: '#002244'
            }}
          >
            <ExternalLink size={13} color="#002244" />
          </a>
        </div>

        {/* Mini Live Progress Bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(0,34,68,0.1)', zIndex: 500 }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #00A896 0%, #00C49F 100%)',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* 3. TRIP METRICS & DESTINATION CARD */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '12px 14px',
          boxShadow: '0 2px 10px rgba(0, 34, 68, 0.05)',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxSizing: 'border-box',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Metric Badges Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
            padding: '8px 10px',
            background: '#F8FAFC',
            borderRadius: '10px',
            border: '1px solid #EDF2F7'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>
              ETA
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#00A896', marginTop: '1px' }}>
              {remainingEta} <span style={{ fontSize: '10px', fontWeight: '600' }}>min</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>
              Distance
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#002244', marginTop: '1px' }}>
              {remainingDist} <span style={{ fontSize: '10px', fontWeight: '600' }}>km</span>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>
              Target
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#002244', marginTop: '1px' }}>
              12:05 <span style={{ fontSize: '9px', fontWeight: '600' }}>PM</span>
            </div>
          </div>
        </div>

        {/* Destination Header Row: Badge, Task ID + Call & Copy Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', minWidth: 0 }}>
            <span
              style={{
                fontSize: '9px',
                fontWeight: '800',
                color: isGoingToPharmacy ? '#002244' : '#00A896',
                background: isGoingToPharmacy ? '#EEF4FB' : '#E6F8F6',
                padding: '2px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.2px'
              }}
            >
              {isGoingToPharmacy ? 'Pharmacy Pickup' : 'Patient Destination'}
            </span>
            <span style={{ fontSize: '9.5px', color: '#94A3B8', fontWeight: '600' }}>• {task?.id}</span>
          </div>

          {/* Call & Copy Buttons */}
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <button
              onClick={handleCopyAddress}
              title="Copy Address"
              style={{
                padding: '5px 8px',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '10.5px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {copiedAddress ? <Check size={11} color="#10B981" /> : <Copy size={11} />}
              <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
            </button>

            <a
              href={`tel:${contactPhone}`}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                background: '#10B981',
                color: '#FFFFFF',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10.5px',
                fontWeight: '700',
                boxShadow: '0 1px 4px rgba(16, 185, 129, 0.25)'
              }}
            >
              <Phone size={11} />
              <span>Call</span>
            </a>
          </div>
        </div>

        {/* Destination Name and Address Block (No Overflow) */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', minWidth: 0, width: '100%' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: isGoingToPharmacy ? '#EEF4FB' : '#E6F8F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}
          >
            {isGoingToPharmacy ? <Store size={16} color="#002244" /> : <User size={16} color="#00A896" />}
          </div>

          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <h3 style={{ fontSize: '13.5px', fontWeight: '800', color: '#002244', margin: 0, lineHeight: 1.2 }}>
              {destinationName}
            </h3>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '4px',
                fontSize: '11px',
                color: '#475569',
                marginTop: '3px',
                lineHeight: 1.35,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%'
              }}
            >
              <MapPin size={12} color="#94A3B8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ flex: 1, minWidth: 0 }}>{destinationAddress}</span>
            </div>
          </div>
        </div>

        {/* Operational Checklist Note */}
        <div
          style={{
            background: '#F0F9FF',
            borderRadius: '7px',
            padding: '7px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid #BAE6FD',
            fontSize: '10.5px',
            color: '#0369A1',
            lineHeight: 1.3
          }}
        >
          <ShieldCheck size={13} color="#0284C7" style={{ flexShrink: 0 }} />
          <span style={{ wordBreak: 'break-word' }}>
            {isGoingToPharmacy
              ? 'Verify medicine batch & cold-chain seals before pickup OTP.'
              : isPharmacy
                ? 'Verify patient identity with OTP before parcel handover.'
                : 'Verify patient identity with OTP before starting sample collection.'}
          </span>
        </div>

        {/* 4. COMPACT & REFINED ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          {!isNavigating && progress < 100 ? (
            <>
              <button
                onClick={handleStartNav}
                style={{
                  flex: '2 1 0',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #00A896 0%, #008779 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '12px',
                  letterSpacing: '0.1px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 8px rgba(0, 168, 150, 0.3)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <Navigation size={14} />
                <span>Start Navigation</span>
              </button>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: '1 1 0',
                  padding: '9px 10px',
                  borderRadius: '8px',
                  background: '#F8FAFC',
                  color: '#002244',
                  border: '1px solid #E2E8F0',
                  fontWeight: '700',
                  fontSize: '11.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <ExternalLink size={13} />
                <span>Google Maps</span>
              </a>
            </>
          ) : isNavigating ? (
            <>
              <button
                onClick={() => setIsNavigating(false)}
                style={{
                  flex: '1 1 0',
                  padding: '9px 10px',
                  borderRadius: '8px',
                  background: '#F1F5F9',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  fontWeight: '700',
                  fontSize: '11.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <Pause size={13} />
                <span>Pause</span>
              </button>

              <button
                onClick={handleManualArrive}
                style={{
                  flex: '2 1 0',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <CheckCircle2 size={14} />
                <span>I Have Arrived</span>
              </button>
            </>
          ) : (
            <button
              onClick={onArrival}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '700',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                cursor: 'pointer'
              }}
            >
              <CheckCircle2 size={14} />
              <span>Arrived at Destination</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
