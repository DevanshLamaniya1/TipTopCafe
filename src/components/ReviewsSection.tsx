import React from "react";
import { AUTHENTIC_REVIEWS } from "../data";
import { Star, MessageSquare, ShieldCheck, Quote } from "lucide-react";

export default function ReviewsSection() {
  return (
    <div className="w-full text-white">
      {/* Visual statistics badge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md">
        <div className="text-center p-4">
          <div className="text-5xl font-black text-amber-400 font-mono">5.0</div>
          <div className="flex justify-center my-2 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-mono">
            Perfect Google Rating
          </p>
        </div>

        <div className="text-center p-4 border-y md:border-y-0 md:border-x border-slate-800/60">
          <div className="text-5xl font-black text-white font-mono">26</div>
          <div className="text-amber-400 text-xs font-bold font-mono my-2 uppercase tracking-wide">
            ★ ★ ★ ★ ★ Verified
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-mono">
            Total Organic Reviews
          </p>
        </div>

        <div className="text-center p-4 flex flex-col justify-center items-center">
          <ShieldCheck className="w-10 h-10 text-emerald-400 mb-2" />
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/5 px-2.5 py-1 border border-emerald-500/20 rounded-lg">
            Gadarwara's Top Choice
          </span>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-2">
            100% Genuine Reviews
          </p>
        </div>
      </div>

      {/* Grid of actual reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AUTHENTIC_REVIEWS.map((review) => (
          <div
            key={review.id}
            className="bg-slate-950/60 border border-slate-800/80 p-6 rounded-3xl relative flex flex-col justify-between group hover:border-slate-700 transition duration-350 shadow-xl"
          >
            {/* Quote watermark background */}
            <Quote className="absolute right-6 top-6 w-12 h-12 text-slate-800/20 group-hover:text-slate-800/35 transition duration-300 pointer-events-none" />

            <div>
              {/* Star line */}
              <div className="flex gap-1 text-amber-400 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 shrink-0" />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-slate-300 italic leading-relaxed relative z-10 font-medium">
                "{review.text}"
              </p>
            </div>

            {/* Author row */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-900">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-10 h-10 rounded-xl border border-slate-800"
              />
              <div>
                <h4 className="font-bold text-sm text-white">{review.name}</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                  <span>Verified local custom visitor</span>
                  <span>•</span>
                  <span>{review.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback request button linked to Google */}
      <div className="mt-12 bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800 p-8 rounded-3xl text-center">
        <h3 className="font-bold text-lg text-white mb-2">Visits that feel like home - leave us a review!</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
          We are committed to delivering the absolute finest gourmet experience in Gadarwara. Enjoyed your pull-apart bread or cold coffee? Help other foodies discover us!
        </p>
        <button
          onClick={() => window.open("https://wa.me/917974969007?text=I'd%20like%20to%20send%2520feedback", "_blank")}
          className="px-6 py-3 bg-slate-900 border border-slate-750 text-amber-400 hover:border-amber-400 hover:bg-slate-850 rounded-xl text-xs font-bold transition-all shadow-md hover:scale-[1.03] active:scale-95 cursor-pointer"
        >
          Submit Feedback / Leave Review
        </button>
      </div>
    </div>
  );
}
