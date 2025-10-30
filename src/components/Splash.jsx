import React, { useEffect, useState } from 'react';

export default function Splash({ minimumMs = 1200 }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setShow(false), minimumMs);
    return () => clearTimeout(id);
  }, [minimumMs]);
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'grid', placeItems: 'center',
      background: '#e2d4ff', zIndex: 100, textAlign: 'center'
    }}>
      <div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#3a2ea0' }}>Weather App</div>
        <div style={{ marginTop: 12, color: '#5b4edb' }}>Loading...</div>
      </div>
    </div>
  );
}


