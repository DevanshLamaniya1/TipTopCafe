import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import TableBooking3D from "./components/TableBooking3D";
import MenuSection from "./components/MenuSection";
import ReviewsSection from "./components/ReviewsSection";
import CartSidebar from "./components/CartSidebar";
import ChatBot from "./components/ChatBot";
import { MENU_ITEMS, HERO_HIGHLIGHTS, CAFE_GALLERY } from "./data";
import { MenuItem, CartItem, Table } from "./types";
import { 
  Coffee, Star, Heart, Clock, Phone, MapPin, 
  ChevronRight, Sparkles, AlertCircle, ShoppingCart, 
  Calendar, RotateCcw, Compass, ArrowUpRight 
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "menu" | "book" | "reviews">("home");
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; msg: string } | null>(null);

  // Lazy initialize cart items state from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("tiptop_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Synchronize cart changes to local storage
  useEffect(() => {
    localStorage.setItem("tiptop_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch tables from our real-time Express backend endpoint
  const fetchTables = useCallback(async () => {
    setIsLoadingTables(true);
    try {
      const res = await fetch("/api/tables");
      if (res.ok) {
        const data = await res.json();
        setTables(data);
      } else {
        throw new Error("Failed to load floor plan.");
      }
    } catch (err: any) {
      console.error(err);
      showNotification("error", "Failed to sync floor seating arrangements.");
    } finally {
      setIsLoadingTables(false);
    }
  }, []);

  // Sync initially on mount
  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const showNotification = (type: "success" | "error" | "info", msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => {
      setNotification((prev) => (prev?.msg === msg ? null : prev));
    }, 4000);
  };

  // Cart operations
  const handleAddToCart = (item: MenuItem, notes?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1, notes: notes || i.notes } : i
        );
      }
      return [...prev, { ...item, quantity: 1, notes: notes || "" }];
    });
    showNotification("success", `Added ${item.name} to your taste cart.`);
  };

  const handleRemoveOneFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter((i) => i.id !== itemId);
      }
      return prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
    });
  };

  const handleUpdateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: qty } : i))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    showNotification("info", "Removed delicacy from cart.");
  };

  const handleUpdateNotes = (itemId: string, notes: string) => {
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, notes } : i))
    );
  };

  // Submit table reservation
  const handleBookTableOnServer = async (bookingData: {
    tableId: number;
    name: string;
    phone: string;
    time: string;
    guests: number;
  }) => {
    try {
      const res = await fetch("/api/tables/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showNotification("success", `Seating allocated successfully! Checked table T-${bookingData.tableId}.`);
        onResetTableSelection();
        // Refresh live data
        await fetchTables();
        return true;
      } else {
        throw new Error(data.error || "Seating conflicts occurred.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to finalize reservation.");
      return false;
    }
  };

  const onResetTableSelection = () => {
    setSelectedTableId(null);
  };

  // Financial Calculations
  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const gstAmount = subtotal * 0.05;
  const grandTotal = subtotal + gstAmount;

  // Build reactive cart dictionary of quantities
  const cartQuantities = cartItems.reduce((acc, curr) => {
    acc[curr.id] = curr.quantity;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-400 selection:text-zinc-950 overflow-x-hidden relative">
      
      {/* Dynamic Global Background glow details */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-rose-500/5 via-amber-500/5 to-transparent pointer-events-none" />

      {/* Floating Notifications UI banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
          >
            <div className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 border ${
              notification.type === "success" 
                ? "bg-emerald-950 border-emerald-500/30 text-emerald-300"
                : notification.type === "error"
                  ? "bg-rose-950 border-rose-500/30 text-rose-300"
                  : "bg-slate-900 border-slate-800 text-amber-300"
            }`}>
              <Sparkles className="w-5 h-5 shrink-0" />
              <p className="text-xs font-semibold leading-relaxed">{notification.msg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Navigation Module */}
      <Navbar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        grandTotal={grandTotal}
      />

      {/* Main Structural Pages Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-16"
            >
              {/* HERO SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
                {/* Left col Text & Badges */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-amber-500/5 p-1.5 pr-4 rounded-full border border-amber-500/20">
                    <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-amber-500 text-zinc-950 font-black rounded-full shadow-md">
                      Verified 5.0 Google Star
                    </span>
                    <span className="text-xs font-medium text-amber-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> (26 Reviews of culinary bliss!)
                    </span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-sans font-black tracking-tight leading-[1.08] text-white">
                    Experience Gadarwara's <br />
                    <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                      Ultimate Dining Jewel
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                    Settle into plush suede sofas, dine beneath masterfully crafted starburst pendant light chandeliers, and explore Gadarwara's finest recipes. Savor rich pull-apart garlic breads and decadent molten lava cakes.
                  </p>

                  {/* Highlight indicators */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 px-2.5 bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 rounded font-mono text-xs mt-1">
                        OPEN
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200 text-sm">Closed · Opens 11 am</h4>
                        <p className="text-xs text-slate-400">Regular: 11 am – 11 pm Daily</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-1 px-2.5 bg-rose-500/10 text-[#ef4444] font-bold border border-rose-500/20 rounded font-mono text-xs mt-1">
                        ₹₹
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200 text-sm">₹600–800 for two</h4>
                        <p className="text-xs text-slate-400">Excellent premium culinary value</p>
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      onClick={() => setActiveTab("menu")}
                      className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/15 hover:shadow-amber-500/30 hover:scale-[1.03] transition duration-300 cursor-pointer flex items-center justify-center gap-2"
                    >
                      Taste Our Menu
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActiveTab("book")}
                      className="px-8 py-4 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition duration-300 cursor-pointer flex items-center justify-center gap-2"
                    >
                      3D Seating Select
                      <Calendar className="w-4 h-4 text-amber-500" />
                    </button>
                  </div>
                </div>

                {/* Right col - 3D Mockup Card Grid Frame */}
                <div className="lg:col-span-5 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent rounded-3xl blur-3xl pointer-events-none" />
                  
                  {/* Visual Frame simulating Cafe Interiors */}
                  <div className="relative border border-slate-800/80 p-6 bg-slate-900/15 rounded-[32px] backdrop-blur-sm shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 bg-red-600 text-[10px] text-white font-mono uppercase tracking-widest px-3 py-1 font-bold z-10 m-3 rounded">
                      Live Landmark Space
                    </div>

                    {/* Image slider / render block */}
                    <div className="h-64 rounded-2xl overflow-hidden border border-slate-800 relative mb-4">
                      <img 
                        src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80" 
                        alt="Tip Top Interior" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                        <span className="text-[10px] text-amber-400 uppercase font-mono font-bold tracking-wider">Premium Atmosphere</span>
                        <h3 className="font-bold text-white text-base">Original Midnight Seating Decor</h3>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-black/40 p-4 border border-slate-900/60 rounded-xl">
                        <div className="text-left text-xs text-slate-400">
                          <span className="block font-mono font-bold text-white text-sm">Gadarwara Patlon</span>
                          Hospital Road, front of comfort hotel, MP 487551
                        </div>
                        <a 
                          href="https://wa.me/916261009496" 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg border border-emerald-500/20 transition shrink-0"
                          title="Call or WhatsApp us"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>

                      {/* Customer check in simulated bubble */}
                      <div className="text-center p-3 text-xs bg-slate-900/40 border-2 border-dashed border-slate-800/60 rounded-xl text-slate-400 leading-relaxed font-mono">
                        ✨ "Best Food in town + Cozy Ambient Space for Birthdays!"
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BENTO GRID ABOUT HIGHLIGHTS */}
              <div className="space-y-6 pt-10">
                <div className="text-center space-y-2">
                  <span className="text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
                    Our Gold Standards
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-white font-sans">
                    Why Locals Cherish Tip Top Cafe
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {HERO_HIGHLIGHTS.map((h, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-950/40 border border-slate-800/80 hover:border-slate-700/60 p-6 rounded-3xl backdrop-blur-md shadow-lg flex flex-col justify-between group"
                    >
                      <span className="text-4xl font-mono text-slate-800 font-semibold mb-4 block group-hover:text-amber-500/40 transition">
                        0{idx + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-lg text-white mb-2">{h.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{h.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GALLERY INTERACTIVE PANELS */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-amber-400 text-xs font-mono font-semibold uppercase block">
                      Cafe Gallery Tour
                    </span>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Our Curated Ambience</h2>
                  </div>
                  <button 
                    onClick={() => setActiveTab("book")}
                    className="text-xs text-amber-400 flex items-center gap-1 hover:underline"
                  >
                    View Layout plan <ArrowUpRight className="w-4 h-4 animate-bounce" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {CAFE_GALLERY.map((g, idx) => (
                    <div 
                      key={idx}
                      className="group relative h-72 rounded-3xl overflow-hidden border border-slate-800 shadow-xl cursor-pointer"
                    >
                      <img 
                        src={g.img} 
                        alt={g.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/40 to-transparent flex flex-col justify-end p-5">
                        <h3 className="font-extrabold text-white text-base">{g.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{g.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FULL LANDMAP ADDRESS & RESERVATION CALL */}
              <div className="bg-slate-905 border border-slate-900 rounded-[32px] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-4 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-[#ef4444] rounded-lg text-xs font-mono">
                    📍 Live Map Coordinates
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-8">
                    Hospital Road, Madhya Pradesh 487551
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-2">
                    Located in the prime vicinity of Gadarwar Patlon directly opposite the Hotel Comfort. Perfect accessibility with private parking convenience and outstanding family ambience.
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-300 font-mono flex-wrap pt-2">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-amber-500" /> Opens 11 AM - 11 PM</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Phone className="w-4 h-4 text-amber-500" /> 079749 69007</span>
                  </div>
                </div>

                <div className="space-y-3 shrink-0 w-full md:w-auto">
                  <button 
                    onClick={() => setActiveTab("book")}
                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/10 hover:scale-[1.02] cursor-pointer"
                  >
                    Select Your Table Seating
                  </button>
                  <p className="text-[10px] text-center text-slate-500">
                    Tables are free of charge. Booking holds your seats for 30 mins.
                  </p>
                </div>
              </div>

            </motion.div>
          )}

          {activeTab === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center max-w-xl mx-auto space-y-2 pb-2">
                <span className="text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
                  Tip Top Specialties
                </span>
                <h2 className="text-3xl md:text-4xl font-sans font-black tracking-tight text-white leading-none">
                  Fulfilling Every Craving
                </h2>
                <p className="text-xs text-slate-400">
                  Select your favorites, add notes to customize the preparation, and direct order easily via WhatsApp instantly.
                </p>
              </div>

              <MenuSection
                items={MENU_ITEMS}
                onAddToCart={handleAddToCart}
                cartQuantities={cartQuantities}
                onRemoveOneFromCart={handleRemoveOneFromCart}
              />
            </motion.div>
          )}

          {activeTab === "book" && (
            <motion.div
              key="book"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <TableBooking3D
                tables={tables}
                selectedTableId={selectedTableId}
                onSelectTable={setSelectedTableId}
                onRefresh={fetchTables}
                activeReservations={{}}
                onBookTable={handleBookTableOnServer}
              />
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center max-w-lg mx-auto space-y-2">
                <span className="text-amber-400 text-xs font-mono font-bold tracking-widest uppercase animate-pulse">
                  Unbiased Customer Love
                </span>
                <h2 className="text-3xl font-black text-white tracking-tight font-sans">
                  The Gadarwara 5.0 Star Benchmark
                </h2>
                <p className="text-xs text-slate-400">
                  Reviews are synchronized from active diners on Google dining at Hospital Road opposite Hotel Comfort.
                </p>
              </div>

              <ReviewsSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Elegant Footer */}
      <footer className="bg-slate-950 border-t border-slate-900/60 pb-20 pt-16 mt-20 relative text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-600 border border-white flex items-center justify-center font-bold text-xs">
              T-T
            </div>
            <span className="font-bold tracking-widest uppercase text-sm">TIP TOP CAFE GADARWARA</span>
          </div>

          <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400 font-mono">
            <span>Opposite Comfort Hotel, Hospital Road, Gadarwara Patlon, Madhya Pradesh 487551</span>
            <span>•</span>
            <span>Call/WhatsApp Support No: 079749 69007</span>
          </div>

          <p className="text-[10px] text-slate-500">
            © {new Date().getFullYear()} Tip Top Cafe. Fully Interactive Concept designed with beautiful 3D, seamless cart flows, and real-time AI capabilities.
          </p>
        </div>
      </footer>

      {/* Sliding Delicacy shopping cart Panel Overlay */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onUpdateNotes={handleUpdateNotes}
        selectedTableId={selectedTableId}
      />

      {/* Core Conversational AI Team Concierge widget */}
      <ChatBot
        cartItems={cartItems}
        selectedTableId={selectedTableId}
        onNavigateToTab={setActiveTab}
        onSelectTable={setSelectedTableId}
      />

    </div>
  );
}
