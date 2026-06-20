import React from "react";
import { CartItem } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Plus, Minus, Trash2, HelpCircle, ArrowRight, Notebook, ShoppingCart } from "lucide-react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  selectedTableId: number | null;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateNotes,
  selectedTableId
}: CartSidebarProps) {
  // Financial Calculations
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const gstRate = 0.05; // 5% standard GST
  const cgstRate = 0.025; // 2.5%
  const sgstRate = 0.025; // 2.5%
  const gstAmount = subtotal * gstRate;
  const deliveryOrTaxInfo = "Gratuity Free Sitting";
  const grandTotal = subtotal + gstAmount;

  // Formatting WhatsApp text message
  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    let orderLines = cartItems
      .map(
        (item) =>
          `• *${item.name}* x ${item.quantity} - ₹${item.price * item.quantity} ${
            item.notes ? `\n   (_Notes: ${item.notes}_)` : ""
          }`
      )
      .join("\n");

    const messageText = encodeURIComponent(
      `🛍️ *NEW ORDER - TIP TOP CAFE (Gadarwara)*\n` +
      `----------------------------------------\n\n` +
      `*Order Details*:\n` +
      `${orderLines}\n\n` +
      `----------------------------------------\n` +
      `• *Subtotal*: ₹${subtotal}\n` +
      `• *GST (5%)*: ₹${gstAmount.toFixed(2)}\n` +
      `• *Grand Total*: *₹${grandTotal.toFixed(2)}*\n\n` +
      `----------------------------------------\n` +
      `${selectedTableId ? `📍 *Sitting Venue*: Table ${selectedTableId}\n` : ""}` +
      `Thank you! Please prepare my order. Fast checkout via Website.`
    );

    // Opening WhatsApp to Cafe support number
    window.open(`https://wa.me/917974969007?text=${messageText}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Sliding Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-950 border-l border-slate-800 z-50 flex flex-col justify-between shadow-2xl text-white"
          >
            {/* Cart Header */}
            <div className="p-5 border-b border-slate-900 flex justify-between items-center bg-slate-900/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-400/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Your Tasting Cart</h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {cartItems.length} ITEM{cartItems.length !== 1 && "S"}{" "}
                    {selectedTableId && `• TABLE ${selectedTableId}`}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 border border-slate-800 hover:border-slate-700 bg-slate-900/60 rounded-xl text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Body - Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3 relative group overflow-hidden"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="max-w-[70%]">
                        <span className="text-[9px] uppercase font-mono text-amber-400 font-semibold tracking-wider">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-amber-500 font-mono font-bold mt-0.5">
                          ₹{item.price} each
                        </p>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 px-2 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/15 text-slate-500 hover:text-rose-400 transition"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quantity Adjustment Row */}
                    <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-xl border border-slate-900">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 px-2 bg-slate-900 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold font-mono w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 px-2 bg-slate-900 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-black font-mono text-white">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                    {/* Custom Note input */}
                    <div className="relative">
                      <Notebook className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 w-3 h-3" />
                      <input
                        type="text"
                        value={item.notes || ""}
                        onChange={(e) => onUpdateNotes(item.id, e.target.value)}
                        placeholder="Add kitchen note (spicy, sugar less...)"
                        className="w-full bg-slate-950/40 border border-slate-900 focus:border-slate-700 text-[11px] placeholder-slate-500 text-slate-300 pl-7 pr-3 py-1.5 rounded-lg outline-none transition"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center py-12">
                  <div className="w-16 h-16 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-center justify-center text-slate-500 mb-4 animate-pulse">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-300">Your Cart is Empty</h4>
                  <p className="text-xs text-slate-500 max-w-[240px] mt-1.5 leading-relaxed">
                    Browse Gadarwara's most delicious treats in our Menu section, add your favorites, and checkout easily!
                  </p>
                </div>
              )}
            </div>

            {/* Cart Footer - Financial breakdown & WhatsApp Send */}
            <div className="p-5 border-t border-slate-900 bg-slate-900/40 space-y-4">
              <div className="space-y-2 text-xs text-slate-400 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5% tax):</span>
                  <span className="text-white font-semibold">₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2.5 border-t border-slate-800">
                  <span className="text-slate-300 font-bold font-sans text-sm">Grand Total:</span>
                  <span className="text-amber-400 font-black text-xl">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {selectedTableId && (
                <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-center text-cyan-300 text-xs">
                  📍 Placed order will be delivered directly to your reserved <span className="font-bold underline">Table {selectedTableId}</span>
                </div>
              )}

              <button
                onClick={handleWhatsAppCheckout}
                disabled={cartItems.length === 0}
                className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  cartItems.length > 0
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.01] cursor-pointer"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                Send Order to WhatsApp
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-slate-500">
                Opening checkout formats your item list and opens official WhatsApp instantly to forward to the chef crew.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
