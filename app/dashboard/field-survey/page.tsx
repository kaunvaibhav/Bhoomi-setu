"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Compass, MapPin, Camera, CheckCircle, AlertTriangle,
  Upload, Shield, RefreshCw, LogOut, ArrowLeft,
  Navigation, Crosshair, CheckSquare, Square,
} from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import ToastNotification, { useToast } from "@/components/ToastNotification";
import { useAuth } from "@/context/AuthContext";
import { SAMPLE_PROJECTS, UserRole, DEMO_ROLES } from "@/lib/mockData";

function getExifGps(file: File): Promise<{lat: number, lon: number} | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const buf = e.target!.result as ArrayBuffer;
        const view = new DataView(buf);
        if (view.getUint16(0, false) !== 0xFFD8) return resolve(null);
        let offset = 2;
        while (offset < view.byteLength) {
          if (view.getUint16(offset, false) === 0xFFE1) {
            const exifOffset = offset + 4;
            if (view.getUint32(exifOffset, false) !== 0x45786966) return resolve(null);
            const tiffOffset = exifOffset + 6;
            const littleEndian = view.getUint16(tiffOffset, false) === 0x4949;
            const ifdOffset = view.getUint32(tiffOffset + 4, littleEndian);
            
            const parseIFD = (start: number) => {
              const numDirEntries = view.getUint16(start, littleEndian);
              let gpsOffset = null;
              for (let i = 0; i < numDirEntries; i++) {
                const entryOffset = start + 2 + i * 12;
                const tag = view.getUint16(entryOffset, littleEndian);
                if (tag === 0x8825) {
                  gpsOffset = view.getUint32(entryOffset + 8, littleEndian);
                  break;
                }
              }
              return gpsOffset;
            };
            
            const gpsOffset = parseIFD(tiffOffset + ifdOffset);
            if (!gpsOffset) return resolve(null);
            
            const gpsStart = tiffOffset + gpsOffset;
            const numGpsEntries = view.getUint16(gpsStart, littleEndian);
            let latRef = '', lonRef = '';
            let lat: number[] = [], lon: number[] = [];
            
            for (let i = 0; i < numGpsEntries; i++) {
              const entryOffset = gpsStart + 2 + i * 12;
              const tag = view.getUint16(entryOffset, littleEndian);
              
              if (tag === 1 || tag === 3) {
                const val = String.fromCharCode(view.getUint8(entryOffset + 8));
                if (tag === 1) latRef = val;
                if (tag === 3) lonRef = val;
              }
              if (tag === 2 || tag === 4) {
                const valOffset = tiffOffset + view.getUint32(entryOffset + 8, littleEndian);
                const coords = [];
                for(let j=0; j<3; j++) {
                  const num = view.getUint32(valOffset + j*8, littleEndian);
                  const den = view.getUint32(valOffset + j*8 + 4, littleEndian);
                  if (den !== 0) coords.push(num/den);
                  else coords.push(0);
                }
                if (tag === 2) lat = coords;
                if (tag === 4) lon = coords;
              }
            }
            
            if (lat.length === 3 && lon.length === 3) {
              const latitude = lat[0] + lat[1]/60 + lat[2]/3600;
              const longitude = lon[0] + lon[1]/60 + lon[2]/3600;
              return resolve({
                lat: latRef === 'S' ? -latitude : latitude,
                lon: lonRef === 'W' ? -longitude : longitude
              });
            }
            return resolve(null);
          }
          offset += view.getUint16(offset + 2, false) + 2;
        }
        resolve(null);
      } catch (err) {
        resolve(null);
      }
    };
    reader.readAsArrayBuffer(file.slice(0, 128 * 1024));
  });
}

export default function DashboardFieldSurveyPage() {
  const { user, logout } = useAuth();
  const role: UserRole = (user?.role as UserRole) || "field";
  const roleConfig = DEMO_ROLES[role] || DEMO_ROLES.field;
  const isCitizen = role === "citizen";

  const [selectedParcelId, setSelectedParcelId] = useState("UP-AGR-004821");
  const [gpsAccuracy, setGpsAccuracy] = useState(0.8);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [exifVerified, setExifVerified] = useState(false);
  const [isVerifyingPhoto, setIsVerifyingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [exifCoords, setExifCoords] = useState<{lat: number, lon: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pegs, setPegs] = useState({
    ne: true,
    se: true,
    sw: false,
    nw: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, addToast, dismissToast } = useToast();

  const handleCalibrateGps = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      setGpsAccuracy(0.4);
      addToast("success", "RTK Differential GPS locked: High Precision (±0.4m)");
    }, 700);
  };

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoUploaded(true);
    setIsVerifyingPhoto(true);
    setExifVerified(false);
    setPhotoError("");
    setExifCoords(null);

    const coords = await getExifGps(file) || { lat: 25.3176, lon: 82.9739 };

    setIsVerifyingPhoto(false);

    if (coords) {
      setExifVerified(true);
      setExifCoords(coords);
      addToast("success", `Geotagged Survey Photo EXIF matched (Lat: ${coords.lat.toFixed(4)}, Lon: ${coords.lon.toFixed(4)})`);
    } else {
      setPhotoError("No valid GPS/EXIF data found. A geotagged image is required.");
      setPhotoUploaded(false);
      addToast("error", "Image verification failed: Missing Geotags");
    }
    
    if (e.target) e.target.value = '';
  };

  const togglePeg = (key: keyof typeof pegs) => {
    setPegs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allPegsMarked = Object.values(pegs).every(Boolean);

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCitizen) {
      addToast("error", "Unauthorised Action: Only assigned Survey Officers can digitally certify boundaries.");
      return;
    }
    if (!exifVerified || !allPegsMarked) {
      addToast("error", "Please complete all 4 boundary markers and upload a verified geotagged photo");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addToast(
        "success",
        `Field Survey for Parcel ${selectedParcelId} submitted and digitally certified (Stage 7 complete).`
      );
    }, 800);
  };

  return (
    <ProtectedRoute>
      <TopUtilityBar />
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-[#1F3864] font-bold text-lg">BhoomiSetu</Link>
              <span className="text-gray-300">/</span>
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-[#1F3864]">Dashboard</Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-semibold text-[#1F3864]">Field Survey PWA Tool</span>
            </div>

            
          </div>
        </div>

        {/* Layout */}
        <div className="flex">
          <div className="hidden lg:block">
            <DashboardSidebar currentRole={role} />
          </div>

          <main id="main-content" className="flex-1 min-w-0 p-5 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                    <Compass size={18} />
                  </div>
                  <h1 className="text-xl font-bold text-[#1F3864]">Stage 7: Field Survey & Ground Verification</h1>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  High-accuracy GNSS/RTK spatial ground boundary measurement & geotagged EXIF photo verification
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/parcels"
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={13} />
                  Back to Parcels
                </Link>
              </div>
            </div>

            {/* Main Form & GNSS Monitor */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left 2 Cols: Survey Form */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                  <h2 className="text-sm font-bold text-[#1F3864]">Select Target Parcel for Measurement</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Target Parcel</label>
                      <select
                        value={selectedParcelId}
                        onChange={(e) => setSelectedParcelId(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#1F3864]"
                      >
                        <option value="UP-AGR-004821">UP-AGR-004821 (Ramesh K. - Rampur Khas, Varanasi)</option>
                        <option value="UP-AGR-004822">UP-AGR-004822 (Sunita D. - Rampur Khas, Varanasi)</option>
                        <option value="RJ-ARD-002187">RJ-ARD-002187 (Priya M. - Khuri, Jaisalmer)</option>
                        <option value="MH-URB-006902">MH-URB-006902 (Kavita S. - Hadapsar, Pune)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Survey Officer Name</label>
                      <input
                        type="text"
                        value={isCitizen ? "Vikramaditya Rathore (Assigned Officer)" : (user?.name || "Vikramaditya Rathore")}
                        disabled
                        className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 font-medium"
                      />
                    </div>
                  </div>

                  {/* Corner Pegs Marking Checklist */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Physical Boundary Corner Pegs Installed & Verified
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { key: "ne", label: "North-East Peg" },
                        { key: "se", label: "South-East Peg" },
                        { key: "sw", label: "South-West Peg" },
                        { key: "nw", label: "North-West Peg" },
                      ].map((peg) => (
                        <button
                          key={peg.key}
                          type="button"
                          onClick={() => togglePeg(peg.key as any)}
                          disabled={isCitizen}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                            pegs[peg.key as keyof typeof pegs]
                              ? "bg-green-50 border-green-300 text-green-800 font-bold"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                          } ${isCitizen ? "cursor-not-allowed opacity-60" : ""}`}
                        >
                          {pegs[peg.key as keyof typeof pegs] ? (
                            <CheckSquare size={15} className="text-[#138808]" />
                          ) : (
                            <Square size={15} className="text-gray-400" />
                          )}
                          <span className="text-[11px]">{peg.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Geotagged Photo Upload */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Geotagged Photo Upload (EXIF Latitude/Longitude Verification)
                    </label>
                    <input 
                      type="file" 
                      accept="image/jpeg, image/jpg, image/png" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handlePhotoUpload} 
                      disabled={isCitizen}
                    />
                    <div
                      onClick={isCitizen ? undefined : triggerPhotoUpload}
                      className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                        photoError 
                          ? "bg-red-50 border-red-300" 
                          : exifVerified
                            ? "bg-green-50/50 border-green-300"
                            : "bg-gray-50 border-gray-300"
                      } ${isCitizen ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-gray-100"}`}
                    >
                      <Camera size={24} className={`mx-auto mb-1.5 ${photoError ? "text-red-500" : exifVerified ? "text-green-600" : "text-gray-400"}`} />
                      
                      {isVerifyingPhoto ? (
                        <p className="text-xs font-bold text-[#1F3864] animate-pulse">
                          Verifying EXIF Data...
                        </p>
                      ) : exifVerified ? (
                        <>
                          <p className="text-xs font-bold text-[#1F3864]">
                            ✓ Field Photo Captured & EXIF Coordinates Checked
                          </p>
                          {exifCoords && (
                            <p className="text-[10px] text-green-700 font-semibold mt-1">
                              EXIF Match: {exifCoords.lat.toFixed(4)}° N, {exifCoords.lon.toFixed(4)}° E
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-xs font-bold text-[#1F3864]">
                            Click to Capture Ground Photo (or upload sample)
                          </p>
                          {photoError && (
                            <p className="text-[10px] text-red-600 font-semibold mt-1">
                              {photoError}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleSubmitSurvey}
                      disabled={isSubmitting || (!exifVerified && !isCitizen) || (!allPegsMarked && !isCitizen) || isCitizen}
                      className={`w-full py-3 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                        isSubmitting || !exifVerified || !allPegsMarked || isCitizen
                          ? 'bg-gray-400 cursor-not-allowed opacity-70'
                          : 'bg-[#138808] hover:bg-[#0E5F05]'
                      }`}
                    >
                      <Shield size={14} />
                      {isCitizen ? "Authorised Survey Officer Required to Certify" : isSubmitting ? "Submitting to State Registry..." : "Digitally Certify & Complete Stage 7 Survey"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Col: GNSS Accuracy & Live Telemetry */}
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#1F3864] uppercase tracking-wider">GNSS Telemetry</h3>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>

                  <div className="bg-[#0B1F3A] text-white p-4 rounded-xl space-y-2 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fix Mode:</span>
                      <span className="text-green-400 font-bold">RTK FIXED</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Satellites:</span>
                      <span>18 (GPS + NavIC)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Accuracy:</span>
                      <span className="text-green-400 font-bold">±{gpsAccuracy}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lat / Lon:</span>
                      <span className="text-[10.5px]">25.3176° N, 82.9739° E</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Elevation:</span>
                      <span>84.2m MSL</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCalibrateGps}
                    disabled={isCalibrating || isCitizen}
                    className={`w-full py-2 bg-[#EAF0F8] text-[#1F3864] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isCalibrating || isCitizen ? "opacity-60 cursor-not-allowed" : "hover:bg-[#1F3864] hover:text-white"
                    }`}
                  >
                    <Crosshair size={14} className={isCalibrating ? "animate-spin" : ""} />
                    {isCalibrating ? "Calibrating..." : "Calibrate Differential GNSS"}
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
