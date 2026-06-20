import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Table, TableReservation } from "../types";
import { Coffee, Sofa, Tv, Sparkles, MapPin, Calendar, Clock, Users, ArrowRight, CheckCircle2, RotateCw, Trash2, Smartphone } from "lucide-react";

interface TableBooking3DProps {
  tables: Table[];
  selectedTableId: number | null;
  onSelectTable: (id: number | null) => void;
  onRefresh: () => void;
  activeReservations: Record<number, TableReservation[]>;
  onBookTable: (bookingData: {
    tableId: number;
    name: string;
    phone: string;
    time: string;
    guests: number;
  }) => Promise<boolean>;
}

export default function TableBooking3D({
  tables,
  selectedTableId,
  onSelectTable,
  onRefresh,
  onBookTable
}: TableBooking3DProps) {
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    time: "07:00 PM",
    guests: 2
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedTable = tables.find((t) => t.id === selectedTableId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? parseInt(value) : value
    }));
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTableId) {
      setErrorMsg("Please select a table on the floor plan first.");
      return;
    }

    if (!formData.name || !formData.phone || !formData.time) {
      setErrorMsg("Please enter your name, phone number, and reservation time.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const success = await onBookTable({
        tableId: selectedTableId,
        name: formData.name,
        phone: formData.phone,
        time: formData.time,
        guests: formData.guests
      });

      if (success) {
        setSuccessMsg(`Table ${selectedTableId} successfully reserved for ${formData.name}!`);
        // Trigger WhatsApp reservation confirmation backup
        const whatsappText = encodeURIComponent(
          `Hi Tip Top Cafe! I have reserved Table ${selectedTableId} (${selectedTable?.name}) on your website.\n\n` +
          `*Details*:\n` +
          `- Name: ${formData.name}\n` +
          `- Phone: ${formData.phone}\n` +
          `- Time: ${formData.time}\n` +
          `- Guests: ${formData.guests} people\n\n` +
          `Please confirm my reservation. Thank you!`
        );
        
        // Open WhatsApp backup
        setTimeout(() => {
          window.open(`https://wa.me/916261009496?text=${whatsappText}`, "_blank");
        }, 1500);

        setFormData({ name: "", phone: "", time: "07:00 PM", guests: 2 });
        onSelectTable(null);
      } else {
        setErrorMsg("Failed to book. This table might already be reserved at this time, or guest limit was exceeded.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during table booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to check if a table is currently reserved
  const isTableReserved = (table: Table) => {
    return table.reservations.length > 0;
  };

  const getTableColor = (table: Table) => {
    const isReserved = isTableReserved(table);
    const isSelected = selectedTableId === table.id;

    if (isSelected) {
      return "bg-amber-400 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] text-black";
    }
    if (isReserved) {
      return "bg-rose-950/80 border-rose-800 text-rose-300 cursor-not-allowed shadow-[inset_0_0_10px_rgba(225,29,72,0.2)]";
    }
    // Available colors
    if (table.type === "sofa") {
      return "bg-emerald-950 border-emerald-500 text-emerald-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]";
    }
    if (table.type === "neon") {
      return "bg-cyan-950 border-cyan-400 text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]";
    }
    return "bg-slate-900 border-cyan-500/50 text-cyan-200 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]";
  };

  return (
    <div className="w-full text-white py-4">
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-rose-500/10 text-rose-400 rounded border border-rose-500/20">
              Interactive 3D Seating Map
            </span>
            <span className="flex items-center gap-1 text-xs text-amber-400">
              <Sparkles className="w-3 h-3 animate-spin duration-3000" /> Live Experience
            </span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mt-1 text-white">
            Choose Your Premium Space
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Tap a table below to explore its details, views, seating arrangement, and book instantly.
          </p>
        </div>

        {/* View togglers & Reset buttons */}
        <div className="flex items-center gap-3">
          <div className="bg-black/40 p-1.5 rounded-lg border border-slate-800 flex items-center">
            <button
              onClick={() => setViewMode("3d")}
              className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${
                viewMode === "3d"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              3D Floor Map
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              List Grid View
            </button>
          </div>

          <button
            onClick={onRefresh}
            className="p-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Refresh Table Status"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Interactive Floor Plan Area */}
        <div className="col-span-1 lg:col-span-8 bg-black/60 border border-slate-800 rounded-3xl p-4 md:p-8 overflow-hidden relative shadow-2xl min-h-[500px] flex flex-col justify-between">
          
          {/* Top Indicators info */}
          <div className="relative z-10 flex flex-wrap gap-4 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800 max-w-fit mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block shadow-[0_0_8px_rgb(16,185,129)]" />
              <span className="text-slate-300">Available Sofa Lounges</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-cyan-400 inline-block shadow-[0_0_8px_rgb(34,211,238)]" />
              <span className="text-slate-300">Cozy Window/Neon Seats</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-rose-700 inline-block border border-rose-500" />
              <span className="text-slate-300">Reserved Tables</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-400 inline-block shadow-[0_0_10px_rgb(245,158,11)]" />
              <span className="text-slate-400">Your Selection</span>
            </div>
          </div>

          {/* 3D Floor plan Render */}
          {viewMode === "3d" ? (
            <div className="relative w-full flex items-center justify-center py-10 scale-95 md:scale-100 overflow-x-auto">
              <div 
                className="relative w-[340px] h-[340px] md:w-[440px] md:h-[440px] bg-slate-950 border border-cyan-500/20 rounded-2xl p-6 transition-all duration-700"
                style={{
                  perspective: "1200px",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* 3D Rotated Perspective container */}
                <div 
                  className="w-full h-full relative transition-all duration-500"
                  style={{
                    transform: "rotateX(55deg) rotateY(0deg) rotateZ(-22deg)",
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Grid floor lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none rounded-xl" />
                  
                  {/* Cafe Walls and Counter (Simulating the back wall of Tip Top Cafe) */}
                  {/* The counter bar */}
                  <div 
                    className="absolute top-0 left-[20%] right-[20%] h-8 bg-zinc-900 border-b-2 border-amber-500 text-center flex items-center justify-center shadow-lg"
                    style={{
                      transform: "translateZ(30px)",
                      transformStyle: "preserve-3d"
                    }}
                  >
                    <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center border-t border-x border-slate-700 text-[10px] font-mono tracking-widest text-amber-400 font-bold">
                      <Coffee className="w-3 h-3 mr-1 text-amber-500 inline" /> MAIN COUNTER & BAR
                    </div>
                  </div>

                  {/* Backdrop glowing logo behind the counter */}
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-12 bg-black border-2 border-red-500 rounded-lg flex flex-col justify-center items-center shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                    style={{
                      transform: "rotateX(-90deg) translateZ(30px) translateY(10px)",
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-[8px] font-extrabold text-white scale-75 shadow-inner">
                      T-T
                    </div>
                    <span className="text-[6px] tracking-widest font-bold text-slate-300">TIP TOP</span>
                  </div>

                  {/* Entrances and signs */}
                  <div 
                    className="absolute bottom-2 left-6 px-3 py-1 bg-cyan-900/40 border border-cyan-400/30 rounded text-[9px] font-mono tracking-wide text-cyan-300 font-semibold"
                    style={{
                      transform: "translateZ(8px)",
                    }}
                  >
                    ← HOSPITAL RD ENTRANCE
                  </div>

                  <div 
                    className="absolute top-1 right-2 px-2 py-0.5 bg-slate-900/60 border border-slate-700 rounded text-[9px] font-mono text-slate-400"
                    style={{
                      transform: "translateZ(8px) rotateZ(90deg)",
                    }}
                  >
                    LUXURY SLEEK TV
                  </div>

                  {/* 3D Rendering of Tables */}
                  {tables.map((table) => {
                    const isReserved = isTableReserved(table);
                    const isSelected = selectedTableId === table.id;
                    const positionX = 50 + table.position.x * 12; // Percentage coordinates
                    const positionZ = 50 + table.position.z * 12;
                    
                    return (
                      <motion.div
                        key={table.id}
                        role="button"
                        onClick={() => {
                          if (!isReserved) {
                            onSelectTable(isSelected ? null : table.id);
                          }
                        }}
                        className={`absolute w-14 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center p-1 rounded-xl border-2 transition-all cursor-pointer select-none text-center ${getTableColor(
                          table
                        )}`}
                        style={{
                          left: `${positionX}%`,
                          top: `${positionZ}%`,
                          transform: `translateZ(${isSelected ? "32px" : "15px"}) translate(-50%, -50%)`,
                          transformStyle: "preserve-3d",
                        }}
                        whileHover={{
                          z: isReserved ? 15 : 32,
                          scale: isReserved ? 1 : 1.05,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {/* 3D thickness side panel effect */}
                        <div 
                          className={`absolute inset-x-0 -bottom-1 h-1.5 rounded-b-md ${
                            isSelected 
                              ? "bg-amber-600" 
                              : isReserved 
                                ? "bg-rose-950" 
                                : table.type === "sofa" 
                                  ? "bg-emerald-800" 
                                  : "bg-cyan-800"
                          }`}
                          style={{
                            transform: "rotateX(-90deg) translateY(0.35rem)",
                            transformOrigin: "bottom"
                          }}
                        />

                        {/* Chairs surrounding the table representing capacity */}
                        {Array.from({ length: table.capacity }).map((_, index) => {
                          const angle = (index * 360) / table.capacity;
                          const rad = (angle * Math.PI) / 180;
                          const radius = 34; // px distance of chair from center
                          const cx = Math.cos(rad) * radius;
                          const cy = Math.sin(rad) * radius;
                          
                          return (
                            <div
                              key={index}
                              className={`absolute w-3.5 h-3.5 rounded border ${
                                isSelected
                                  ? "bg-amber-500 border-amber-300 shadow-[0_0_4px_rgba(251,191,36,1)]"
                                  : isReserved
                                    ? "bg-rose-950 border-rose-800"
                                    : table.type === "sofa"
                                      ? "bg-emerald-600/60 border-emerald-500/50"
                                      : "bg-slate-800 border-cyan-500/40"
                              }`}
                              style={{
                                transform: `translate3d(${cx}px, ${cy}px, -6px) rotateZ(${angle}deg)`,
                              }}
                            />
                          );
                        })}

                        {/* Table Icon / Name */}
                        <div className="z-10 flex flex-col items-center">
                          {table.type === "sofa" ? (
                            <Sofa className={`w-4 h-4 mb-0.5 ${isSelected ? 'text-black' : 'text-emerald-400'}`} />
                          ) : (
                            <Coffee className={`w-4 h-4 mb-0.5 ${isSelected ? 'text-black' : 'text-cyan-400'}`} />
                          )}
                          <span className={`text-[9px] font-extrabold tracking-tighter ${isSelected ? 'text-zinc-950' : 'text-zinc-200'}`}>
                            T-{table.id}
                          </span>
                          <span className={`text-[7px] block -mt-0.5 opacity-80 ${isSelected ? 'text-zinc-900 font-bold' : 'text-slate-400'}`}>
                            {table.capacity} Pax
                          </span>
                        </div>

                        {/* If reserved, print a lock seal */}
                        {isReserved && (
                          <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                            <span className="text-[7px] text-rose-400 font-mono font-bold tracking-wider rotate-12 scale-105 border border-rose-500/50 px-1 py-0.2 rounded-sm bg-black/80">
                              RESERVED
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Flat view - List Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4">
              {tables.map((table) => {
                const isReserved = isTableReserved(table);
                const isSelected = selectedTableId === table.id;

                return (
                  <div
                    key={table.id}
                    onClick={() => {
                      if (!isReserved) {
                        onSelectTable(isSelected ? null : table.id);
                      }
                    }}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-400"
                        : isReserved
                          ? "bg-rose-950/20 border-rose-500/30 text-slate-500 cursor-not-allowed"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded uppercase font-mono ${
                        isReserved ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-400"
                      }`}>
                        {isReserved ? "Reserved" : "Available"}
                      </span>
                      {table.type === "sofa" ? (
                        <Sofa className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Coffee className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm text-white">{table.name}</h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3. h-3" /> Max {table.capacity} Guests
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick instructions on the layout and landmark coordinates info */}
          <div className="text-[11px] text-slate-400 bg-slate-950/95 p-3 rounded-2xl border border-slate-900 flex justify-between items-center relative z-10 flex-wrap gap-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> Hospital road, Opposite Comfort Hotel, Gadarwara
            </span>
            <span className="text-amber-400 font-semibold">
              Tip: Couch lounges (T-2, T-3) are extremely premium
            </span>
          </div>
        </div>

        {/* Right Hand: Interactive Reservation Form */}
        <div className="col-span-1 lg:col-span-4 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden flex flex-col">
          
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-full blur-xl pointer-events-none" />

          {/* Table Card Selection Details */}
          <h3 className="text-lg font-semibold border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
            <span>Reservation Desk</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </h3>

          <AnimatePresence mode="wait">
            {selectedTable ? (
              <motion.div
                key="table-selected"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 bg-amber-500/10 border border-amber-400/30 p-4 rounded-2xl"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-amber-300 text-base">{selectedTable.name}</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-amber-400 text-black rounded font-mono">
                    SEAT CHOSEN
                  </span>
                </div>
                
                <div className="mt-2 text-xs text-slate-300 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-400">Section Style:</span>
                    <span className="capitalize">{selectedTable.type} lounge area</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-400">Total Seating Limit:</span>
                    <span>{selectedTable.capacity} persons max</span>
                  </p>
                  <p className="text-[10px] text-amber-300/80 italic mt-2">
                    *Table reservation is free. No extra platform fees!
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="no-table-selected"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 border border-dashed border-slate-800 p-6 rounded-2xl text-center bg-black/10"
              >
                <div className="w-12 h-12 rounded-full bg-slate-800/40 flex items-center justify-center mx-auto mb-3">
                  <Coffee className="w-5 h-5 text-slate-400" />
                </div>
                <h4 className="font-semibold text-slate-300 text-sm">No Table Selected Yet</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Browse the map on the left and select an available table to unlock the booking panel.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleBookSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Amit, Riya, style name"
                  disabled={!selectedTableId}
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                WhatsApp Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +91 98765 43210"
                  disabled={!selectedTableId}
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Time Slot
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  disabled={!selectedTableId}
                  className="w-full bg-slate-950/85 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 text-white rounded-xl px-3 py-2.5 text-sm outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option>11:30 AM</option>
                  <option>01:00 PM</option>
                  <option>02:30 PM</option>
                  <option>04:00 PM</option>
                  <option>05:30 PM</option>
                  <option>07:00 PM</option>
                  <option>08:30 PM</option>
                  <option>10:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  No. of Guests
                </label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  disabled={!selectedTableId}
                  className="w-full bg-slate-950/85 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 text-white rounded-xl px-3 py-2.5 text-sm outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedTable &&
                    Array.from({ length: selectedTable.capacity }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} Player{i > 0 && "s"}
                      </option>
                    ))}
                  {!selectedTable && <option value={2}>2 Guests</option>}
                </select>
              </div>
            </div>

            {/* Notifications */}
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Booking Confirmed!</span>
                  {successMsg}
                  <span className="block mt-1 text-[10px] text-emerald-300">
                    Redirecting to WhatsApp for instant team backup...
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedTableId || isSubmitting}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                selectedTableId
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.02] cursor-pointer"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  Securing Table...
                </>
              ) : (
                <>
                  Book & WhatsApp Confirm
                  <Smartphone className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom security disclaimer details */}
          <p className="text-[10px] text-slate-500 mt-6 text-center leading-relaxed">
            Reserving our table creates an automated entry in memory. Showing the online slip qualifies you for immediate priority sitting on Hospital Road.
          </p>
        </div>
      </div>
    </div>
  );
}
