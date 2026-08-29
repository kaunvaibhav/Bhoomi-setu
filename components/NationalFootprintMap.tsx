"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, GeoJSON, WMSTileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RotateCcw, Layers, MapPin, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { MOCK_PARCELS_GEOJSON } from "@/lib/mockParcelsGeoJSON";

// Project state metrics as specified in requirements
export interface ProjectStateMetric {
  id: string;
  name: string;
  lat: number;
  lng: number;
  activeProjects: number;
  areaNotified: number; // in hectares
  possessionPercent: number;
  status: "on-track" | "in-progress" | "at-risk";
  statusLabel: string;
  markerColor: string; // Blue for normal, Orange for attention, Green for performing well
  accentColor: string;
}

export const STATE_PROJECT_DATA: ProjectStateMetric[] = [
  {
    id: "UP",
    name: "Uttar Pradesh",
    lat: 26.8467,
    lng: 80.9462,
    activeProjects: 14,
    areaNotified: 8420,
    possessionPercent: 62,
    status: "in-progress",
    statusLabel: "Normal / In Progress",
    markerColor: "#2563EB", // Blue for normal / in-progress
    accentColor: "#3B82F6",
  },
  {
    id: "RJ",
    name: "Rajasthan",
    lat: 26.9124,
    lng: 74.8873,
    activeProjects: 9,
    areaNotified: 6180,
    possessionPercent: 45,
    status: "at-risk",
    statusLabel: "Needs Attention",
    markerColor: "#EA580C", // Orange for needing attention
    accentColor: "#F97316",
  },
  {
    id: "MH",
    name: "Maharashtra",
    lat: 19.7515,
    lng: 75.7139,
    activeProjects: 11,
    areaNotified: 4320,
    possessionPercent: 78,
    status: "on-track",
    statusLabel: "Performing Well",
    markerColor: "#138808", // Green for performing well
    accentColor: "#16A34A",
  },
  {
    id: "KA",
    name: "Karnataka",
    lat: 14.5204,
    lng: 75.7224,
    activeProjects: 7,
    areaNotified: 3140,
    possessionPercent: 55,
    status: "in-progress",
    statusLabel: "Normal / In Progress",
    markerColor: "#2563EB", // Blue for normal / in-progress
    accentColor: "#3B82F6",
  },
  {
    id: "MP",
    name: "Madhya Pradesh",
    lat: 23.2599,
    lng: 77.4126,
    activeProjects: 8,
    areaNotified: 2800,
    possessionPercent: 38,
    status: "at-risk",
    statusLabel: "Needs Attention",
    markerColor: "#EA580C", // Orange for needing attention
    accentColor: "#F97316",
  },
];

// Helper to create clean custom HTML markers with color coding and project count
function createMarkerIcon(state: ProjectStateMetric) {
  const pulseHtml = state.status === "at-risk"
    ? `<span style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background-color: ${state.markerColor}; opacity: 0.35; animation: leaflet-marker-pulse 2s infinite ease-out;"></span>`
    : "";

  return L.divIcon({
    className: "bhoomi-project-marker",
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; cursor: pointer;">
        ${pulseHtml}
        <div style="
          width: 30px; 
          height: 30px; 
          border-radius: 50%; 
          background: ${state.markerColor}; 
          border: 2.5px solid #FFFFFF; 
          box-shadow: 0 3px 8px rgba(31, 56, 100, 0.28); 
          display: flex; 
          align-items: center; 
          justify-content: center;
          position: relative;
          z-index: 2;
        ">
          <span style="color: #FFFFFF; font-size: 11px; font-weight: 700; font-family: Inter, sans-serif; letter-spacing: -0.2px;">
            ${state.id}
          </span>
        </div>
        <div style="
          position: absolute; 
          bottom: -7px; 
          background: #1F3864; 
          color: #FFFFFF; 
          font-size: 9px; 
          font-weight: 700; 
          padding: 1px 4px; 
          border-radius: 8px; 
          border: 1px solid #FFFFFF; 
          white-space: nowrap; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.18);
          z-index: 3;
          font-family: Inter, sans-serif;
        ">
          ${state.activeProjects}p
        </div>
      </div>
    `,
    iconSize: [34, 40],
    iconAnchor: [17, 20],
    popupAnchor: [0, -22],
  });
}

// Controller component to reset map view
function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export default function NationalFootprintMap() {
  const defaultCenter: [number, number] = [22.8, 79.6];
  const defaultZoom = 4.3;
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const handleResetView = () => {
    if (mapInstance) {
      mapInstance.flyTo(defaultCenter, defaultZoom, { duration: 1.2 });
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Header & Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#1F3864] font-semibold border border-blue-200/70 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Interactive National GIS
          </span>
          <span className="hidden sm:inline text-gray-400">|</span>
          <span className="hidden sm:inline text-[11px] text-gray-500 font-medium">
            OpenStreetMap Engine
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-gray-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#138808] border border-white shadow-xs" />
            Performing Well (≥60%)
          </span>
          <span className="flex items-center gap-1 text-gray-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] border border-white shadow-xs" />
            In Progress
          </span>
          <span className="flex items-center gap-1 text-gray-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] border border-white shadow-xs" />
            Needs Attention
          </span>

          <button
            type="button"
            onClick={handleResetView}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white text-[#1F3864] hover:bg-slate-50 border border-gray-200 transition-colors shadow-2xs cursor-pointer ml-1"
            title="Recenter map to India"
          >
            <RotateCcw size={12} />
            <span className="hidden md:inline text-[10px] font-semibold">Reset View</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas Container */}
      <div className="relative flex-1 w-full min-h-[380px] rounded-xl overflow-hidden border border-slate-200/90 shadow-inner bg-[#F1F5F9]">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          minZoom={3.5}
          maxZoom={9}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ height: "100%", width: "100%", zIndex: 1 }}
          ref={setMapInstance}
        >
          <MapViewController center={defaultCenter} zoom={defaultZoom} />

          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OpenStreetMap (Standard)">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="gov-osm-tiles"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="ISRO Bhuvan (Satellite)">
              <WMSTileLayer
                attribution='&copy; <a href="https://bhuvan.nrsc.gov.in" target="_blank" rel="noopener noreferrer">ISRO Bhuvan</a>'
                url="https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms"
                layers="multilayers"
                format="image/png"
                transparent={false}
                version="1.1.1"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="High-Res Satellite (Backup)">
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>

            <LayersControl.Overlay checked name="Land Parcels (GeoJSON)">
              <GeoJSON
                data={MOCK_PARCELS_GEOJSON}
                style={(feature) => {
                  const flagged = feature?.properties?.flagged;
                  const status = feature?.properties?.status;
                  let color = "#3B82F6"; // default blue
                  if (flagged) color = "#DC2626"; // red for anomaly
                  else if (status === "acquired") color = "#16A34A"; // green
                  else if (status === "compensated") color = "#2563EB"; // blue
                  else if (status === "disputed") color = "#D97706"; // amber
                  
                  return {
                    fillColor: color,
                    weight: 1.5,
                    opacity: 0.8,
                    color: color,
                    fillOpacity: 0.4,
                    dashArray: flagged ? "4, 4" : undefined
                  };
                }}
                onEachFeature={(feature, layer) => {
                  const props = feature.properties;
                  const popupContent = `
                    <div style="font-family: Inter, sans-serif; padding: 4px; min-width: 190px; text-align: left;">
                      <div style="font-weight: 700; color: #1F3864; font-size: 12px; margin-bottom: 2px;">
                        Parcel: ${props.ulpin}
                      </div>
                      <div style="font-size: 9px; color: #6B7280; font-weight: 500; margin-bottom: 6px;">
                        ${props.project}
                      </div>
                      <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 8px; font-size: 10px; border-top: 1px solid #E2E8F0; padding-top: 6px;">
                        <span style="color: #64748B;">Owner:</span><span style="font-weight: 600; color: #1E293B;">${props.ownerName}</span>
                        <span style="color: #64748B;">Area:</span><span style="font-weight: 600; color: #1E293B;">${props.area}</span>
                        <span style="color: #64748B;">Type:</span><span style="font-weight: 500; color: #1E293B;">${props.landType}</span>
                        <span style="color: #64748B;">Status:</span><span style="font-weight: 700; text-transform: uppercase; color: ${props.status === 'acquired' ? '#16A34A' : props.status === 'disputed' ? '#DC2626' : '#2563EB'};">${props.status}</span>
                        <span style="color: #64748B;">Valuation:</span><span style="font-weight: 600; color: #1E293B;">${props.declaredValue}</span>
                      </div>
                      ${props.flagged ? `
                        <div style="margin-top: 8px; padding: 4px 6px; background: #FEF2F2; border-left: 3px solid #EF4444; border-radius: 4px; font-size: 9px; color: #991B1B;">
                          <strong>Valuation Flag:</strong> Anomaly Score ${props.anomalyScore}%
                        </div>
                      ` : ""}
                    </div>
                  `;
                  layer.bindPopup(popupContent, { minWidth: 190 });
                  
                  layer.on({
                    mouseover: (e) => {
                      const l = e.target;
                      l.setStyle({
                        fillOpacity: 0.7,
                        weight: 2.5
                      });
                    },
                    mouseout: (e) => {
                      const l = e.target;
                      l.setStyle({
                        fillOpacity: 0.4,
                        weight: 1.5
                      });
                    }
                  });
                }}
              />
            </LayersControl.Overlay>
          </LayersControl>

          {/* State Markers */}
          {STATE_PROJECT_DATA.map((state) => {
            const icon = createMarkerIcon(state);
            return (
              <Marker
                key={state.id}
                position={[state.lat, state.lng]}
                icon={icon}
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.openPopup();
                  },
                  click: (e) => {
                    e.target.openPopup();
                  },
                }}
              >
                <Popup
                  className="bhoomi-popup-clean"
                  closeButton={true}
                  autoPan={false}
                >
                  <div className="p-3.5 min-w-[210px] max-w-[260px] text-left font-sans">
                    {/* State Header */}
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#1F3864]" />
                          <h4 className="font-bold text-sm text-[#1F3864] leading-tight">
                            {state.name}
                          </h4>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                          State Jurisdiction ({state.id})
                        </p>
                      </div>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white"
                        style={{ backgroundColor: state.markerColor }}
                      >
                        {state.status === "on-track"
                          ? "Good"
                          : state.status === "at-risk"
                          ? "Attention"
                          : "Active"}
                      </span>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[10px] text-gray-500 block">Active Projects</span>
                        <span className="text-xs font-bold text-[#1F3864]">
                          {state.activeProjects} projects
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block">Notified Area</span>
                        <span className="text-xs font-bold text-[#1F3864]">
                          {state.areaNotified.toLocaleString("en-IN")} ha
                        </span>
                      </div>
                    </div>

                    {/* Possession Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[11px] font-medium text-gray-600">
                          Acquisition Progress
                        </span>
                        <span
                          className="font-bold text-xs"
                          style={{ color: state.markerColor }}
                        >
                          {state.possessionPercent}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${state.possessionPercent}%`,
                            backgroundColor: state.markerColor,
                          }}
                        />
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1 italic">
                        {state.possessionPercent}% physical possession recorded
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2 px-1 text-[10px] text-gray-400">
        <span>Hover or click markers for state metrics · Pan and zoom enabled</span>
        <span className="font-medium text-[#1F3864]">MoRD · DoLR | RFCTLARR GIS</span>
      </div>
    </div>
  );
}
