import React from "react";

const singapore = new URL("../assets/Singapore.jpg", import.meta.url).href;
const malaysia = new URL("../assets/Malaysia.jpg", import.meta.url).href;

export default function InternationalTours() {
  return (
    <section className="bg-[#f7fbff] py-10 px-4 md:px-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-[#dbeafe] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
        <div className="bg-[#eff6ff] px-6 py-5 md:px-8 md:py-6">
          <p className="text-sm uppercase tracking-[0.3em] font-semibold text-[#2563eb]">
            International Tour Available
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="relative overflow-hidden min-h-[280px] rounded-b-[30px] md:rounded-none md:rounded-l-[30px]">
            <img src={singapore} alt="Singapore" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <p className="text-2xl font-semibold text-white">Singapore</p>
              <p className="mt-2 text-sm text-white/80">Luxury city stay packages available.</p>
            </div>
          </article>

          <article className="relative overflow-hidden min-h-[280px] rounded-b-[30px] md:rounded-none md:rounded-r-[30px]">
            <img src={malaysia} alt="Malaysia" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <p className="text-2xl font-semibold text-white">Malaysia</p>
              <p className="mt-2 text-sm text-white/80">Beach and rainforest tours ready to book.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
