import React, { useState } from "react";
import { MenuItem } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Search, Star, ShoppingCart, Plus, Minus, Tag, Coffee, Flame, AlertCircle } from "lucide-react";
import { CATEGORIES } from "../data";

interface MenuSectionProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem, notes?: string) => void;
  cartQuantities: Record<string, number>;
  onRemoveOneFromCart: (itemId: string) => void;
}

export default function MenuSection({
  items,
  onAddToCart,
  cartQuantities,
  onRemoveOneFromCart
}: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Dishes");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filter items based on active category, search, and selected special tags
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All Dishes" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || item.tags.includes(selectedTag);

    return matchesCategory && matchesSearch && matchesTag;
  });

  // Extract all unique tags in the current menu for filter chips!
  const allUniqueTags = Array.from(
    new Set(items.flatMap((item) => item.tags))
  );

  return (
    <div className="w-full text-white">
      {/* Search and Tag filter panel */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8 bg-slate-900/40 p-4 border border-slate-800/80 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search specialties (e.g., Cold Coffee, loaded pizza, brownie)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition"
          />
        </div>

        {/* Dynamic active Tag chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-amber-500" /> Filter tags:
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              !selectedTag
                ? "bg-amber-500 border-amber-400 text-zinc-950 font-bold"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
            }`}
          >
            All
          </button>
          {allUniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1 text-xs rounded-full border transition-all flex items-center gap-1 ${
                selectedTag === tag
                  ? "bg-amber-500 border-amber-400 text-zinc-950 font-bold shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
            >
              {tag === "Spicy" && <Flame className="w-3 h-3 text-rose-400 inline" />}
              {tag === "Signature" && <Star className="w-3 h-3 text-amber-400 inline" />}
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Horizontal Scroller Tab Menu */}
      <div className="mb-10 overflow-x-auto scroller-hide border-b border-slate-800 flex items-stretch">
        <div className="flex space-x-6 pb-2 min-w-full">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedTag(null); // Reset tag on category change for better navigation
                }}
                className={`relative pb-3 text-sm font-semibold tracking-wide whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected ? "text-amber-400 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                {category}
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryBorder"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Cards Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`${selectedCategory}-${searchQuery}-${selectedTag}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const qtyInCart = cartQuantities[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className="group bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden shadow-xl"
                >
                  {/* Subtle hover background glow */}
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />

                  <div>
                    {/* Top row with Rating & tags */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold border ${
                              tag === "Best Seller" || tag === "Signature"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                                : tag === "Spicy"
                                  ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                  : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-lg border border-slate-800 text-amber-400 text-xs font-bold font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
                        {item.rating.toFixed(1)}
                      </div>
                    </div>

                    {/* Delicacy Name and Desc */}
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors tracking-tight leading-6 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed line-clamp-3 mb-4">
                      {item.desc}
                    </p>
                  </div>

                  {/* Pricing and Addition Controls */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-900">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">
                        Price
                      </span>
                      <span className="text-xl font-black text-white font-mono tracking-tight">
                        ₹{item.price}
                      </span>
                    </div>

                    {/* Cart Interactive Controls */}
                    {qtyInCart > 0 ? (
                      <div className="flex items-center bg-amber-500 text-zinc-950 font-bold rounded-xl overflow-hidden shadow-lg border border-amber-400 gap-2 p-1">
                        <button
                          onClick={() => onRemoveOneFromCart(item.id)}
                          className="p-1 px-2.5 hover:bg-amber-600 rounded-lg text-zinc-950 transition active:scale-90"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-semibold font-mono w-4 text-center">
                          {qtyInCart}
                        </span>
                        <button
                          onClick={() => onAddToCart(item)}
                          className="p-1 px-2.5 hover:bg-amber-600 rounded-lg text-zinc-950 transition active:scale-90"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAddToCart(item)}
                        className="p-2 py-2.5 px-4 bg-slate-850 hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-500 hover:text-zinc-950 border border-slate-700 hover:border-amber-400 text-slate-200 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-amber-500/10 active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Set to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
              <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h4 className="text-slate-300 font-semibold mb-1">No Culinary Creations Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No dishes in {selectedCategory} match your search or filters. Try adjusting your items or clearing your query.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Decorative prompt about catering custom requests */}
      <div className="mt-14 p-6 bg-gradient-to-r from-emerald-950/20 to-slate-900/40 border border-emerald-500/10 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white">Have a special custom culinary request?</h4>
            <p className="text-xs text-slate-400">
              Our Tip Top chefs in Gadarwara can customize spiciness, sugar ratios, or fulfill vegan requirements perfectly.
            </p>
          </div>
        </div>
        <span className="text-xs text-emerald-400 bg-emerald-500/5 px-3 py-1.5 border border-emerald-500/20 rounded-lg">
          Zero customization charge! Just add notes in your checkout.
        </span>
      </div>
    </div>
  );
}
