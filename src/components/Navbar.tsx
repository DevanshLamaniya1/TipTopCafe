import React, { useState } from "react";
import { Coffee, ShoppingCart, Menu, X, Star, Calendar, MessageSquare, Utensils, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  activeTab: "home" | "menu" | "book" | "reviews";
  onChangeTab: (tab: "home" | "menu" | "book" | "reviews") => void;
  cartCount: number;
  onOpenCart: () => void;
  grandTotal: number;
}

export default function Navbar({
  activeTab,
  onChangeTab,
  cartCount,
  onOpenCart,
  grandTotal
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Special Welcome", icon: Utensils },
    { id: "menu", label: "Tasting Menu", icon: Coffee },
    { id: "book", label: "3D Seating Reserve", icon: Calendar },
    { id: "reviews", label: "Google Reviews", icon: Star }
  ] as const;

  const handleLinkClick = (tabId: "home" | "menu" | "book" | "reviews") => {
    onChangeTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-900/80 z-40 text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Glowing Brand Logo representation */}
          <div 
            onClick={() => handleLinkClick("home")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.7)] group-hover:scale-105 transition duration-300">
              <span className="text-[12px] font-extrabold tracking-tighter text-white">T-T</span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black text-lg tracking-wider text-white group-hover:text-amber-400 transition-colors uppercase leading-none">
                Tip Top Cafe
              </span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#ef4444] uppercase mt-0.5">
                ● Gadarwara Patlon
              </span>
            </div>
          </div>

          {/* Desktop Links with Framer layoutId */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isSelected = activeTab === link.id;
              const LinkIcon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSelected ? "text-amber-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                  {link.label}
                  {isSelected && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-slate-900/50 border border-slate-800 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Hand Controls (Cart) */}
          <div className="flex items-center gap-3">
            {/* Cart trigger button with real-time total indicator */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 px-4 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 hover:text-amber-300 rounded-xl flex items-center gap-2.5 transition active:scale-95 cursor-pointer"
              title="Open tasting cart"
            >
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              {cartCount > 0 && (
                <span className="hidden sm:inline text-xs font-mono font-bold text-white">
                  ₹{grandTotal.toFixed(0)}
                </span>
              )}
              
              {/* Badge indicator */}
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 font-mono font-bold text-[10px] text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 bg-slate-900/40 border border-slate-800/80 rounded-xl text-slate-400 hover:text-white transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950 border-t border-slate-900 overflow-hidden"
          >
            <div className="px-4 pt-20 pb-4 space-y-2">
              {navLinks.map((link) => {
                const isSelected = activeTab === link.id;
                const LinkIcon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? "bg-slate-900 text-amber-400 border-l-4 border-amber-400"
                        : "text-slate-400 hover:bg-slate-900/40 hover:text-white"
                    }`}
                  >
                    <LinkIcon className="w-4 h-4 text-amber-500" />
                    {link.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
