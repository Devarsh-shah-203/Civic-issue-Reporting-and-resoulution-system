"use client";

import { useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "../../utils/constants";

const pinIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
        <path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 26 16 26s16-14 16-26C32 7.2 24.8 0 16 0z" fill="#1B4B66"/>
        <circle cx="16" cy="16" r="6.5" fill="#F2A93B"/>
      </svg>`
    ),
  iconSize: [32, 42],
  iconAnchor: [16, 42],
});

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({ value, onChange, height = "320px", readOnly = false }) {
  const [locating, setLocating] = useState(false);
  const center = value?.lat ? [value.lat, value.lng] : [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng];

  const handlePick = useCallback(
    (coords) => {
      onChange({ ...value, ...coords, address: value?.address || "" });
    },
    [onChange, value]
  );

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handlePick({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div>
      {!readOnly && (
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs text-ink-muted">Tap the map to drop a pin at the exact spot.</p>
          <button
            type="button"
            onClick={useMyLocation}
            className="text-xs font-semibold text-civic-600 hover:underline"
          >
            {locating ? "Locating…" : "📍 Use my location"}
          </button>
        </div>
      )}

      <div style={{ height }} className="overflow-hidden rounded-lg border border-surface-border">
        <MapContainer
          center={center}
          zoom={DEFAULT_MAP_ZOOM}
          scrollWheelZoom={false}
          dragging={!readOnly}
          zoomControl={!readOnly}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {!readOnly && <ClickHandler onPick={handlePick} />}
          {value?.lat && <Marker position={[value.lat, value.lng]} icon={pinIcon} />}
        </MapContainer>
      </div>

      {value?.lat && (
        <p className="mt-2 font-mono text-xs text-ink-muted">
          {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}
