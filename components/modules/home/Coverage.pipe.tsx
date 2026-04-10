"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";


import rawData from "@/data/coverage.json";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

interface CoverageItem {
  region: string;
  district: string;
  city: string;
  covered_area: string[];
  status: string;
  latitude: number;
  longitude: number;
}

const DHAKA_COORDS: [number, number] = [23.8103, 90.4125];

export default function CoverageMap() {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [targetLocation, setTargetLocation] = useState<[number, number] | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<CoverageItem | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [leafletIcon, setLeafletIcon] = useState<any>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const inputRef = useRef<HTMLDivElement>(null);

 
  const coverageData = rawData as CoverageItem[];

  useEffect(() => {
    import("leaflet").then((L) => {
      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      setLeafletIcon(icon);
    });
  }, []);

  const suggestions = useMemo(() => {
    if (!query) return [];
    const q = query.trim().toLowerCase();
    return coverageData
      .filter((d) => d.district.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, coverageData]);

  const moveToLocation = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 10, { animate: true, duration: 1.5 });
    }
  };

  const handleSelect = (item: CoverageItem) => {
    setQuery(item.district);
    setShowSuggestions(false);
    setSelectedDistrict(item);
    setTargetLocation([item.latitude, item.longitude]);
    moveToLocation(item.latitude, item.longitude);
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerm = query.trim().toLowerCase();
    
   
    const found = coverageData.find(
      (d) => d.district.toLowerCase() === searchTerm
    );

    if (found) {
      handleSelect(found);
    } else {
      alert(`'${query}' নামে কোনো জেলা পাওয়া যায়নি। সাজেশন থেকে সিলেক্ট করুন।`);
    }
  };

  return (
    <section id="coverage" className="relative py-24 bg-[#06060b] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            Our <span className="italic bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] bg-clip-text text-transparent">Coverage Area</span>
          </h2>
        </div>

        <div ref={inputRef} className="relative max-w-lg mx-auto mb-10 z-[1000]">
          <form onSubmit={onSearchSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00F5A0]" />
              <input
                type="text"
                placeholder="Search district (e.g. Dhaka)..."
                value={query}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#00F5A0]/50"
                suppressHydrationWarning
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute top-full mt-2 left-0 right-0 bg-[#10101e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  {suggestions.map((item) => (
                    <li
                      key={item.district}
                      onClick={() => handleSelect(item)}
                      className="px-6 py-4 hover:bg-[#00F5A0]/10 text-white cursor-pointer flex justify-between border-b border-white/5 last:border-0"
                    >
                      <span className="font-bold">{item.district}</span>
                      <span className="text-white/30 text-xs uppercase">{item.region}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button type="submit" className="h-14 px-8 rounded-2xl font-black bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-[#06060b]">
              Search
            </button>
          </form>
        </div>

        <div className="w-full h-[550px] rounded-[3rem] overflow-hidden border border-white/10 relative shadow-2xl">
          <MapContainer 
            center={DHAKA_COORDS} 
            zoom={7} 
            className="h-full w-full grayscale-[0.8] invert-[0.9] hue-rotate-[180deg]"
            ref={mapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {leafletIcon && coverageData.map((loc) => (
              <Marker 
                key={loc.district} 
                position={[loc.latitude, loc.longitude]} 
                icon={leafletIcon}
                eventHandlers={{
                  click: () => handleSelect(loc),
                }}
              >
                <Popup>
                  <div className="p-2 text-[#06060b]">
                    <h5 className="font-black uppercase text-xs">{loc.district} HUB</h5>
                    <p className="text-[10px]">{loc.covered_area.slice(0, 3).join(", ")}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}