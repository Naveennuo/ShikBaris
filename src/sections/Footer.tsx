import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const logo = new URL("../assets/ShiGOlogo1.svg", import.meta.url).href;
const nav = ["India", "International", "Luxury", "Car Rental", "Contact"];

export default function Footer() {
  return (
    <footer className="bg-[#000721] text-white py-10">
      <div className="max-w-[1232px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Location */}
        <div>
          <img src={logo} alt="ShiGO" className="h-12 mb-3" />
          <p className="flex items-center gap-2 text-sm text-white/70">
            <MapPin size={16} className="text-[#0092fb]" />
            Madurai, Tamil Nadu, India
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="font-semibold mb-3">Quick Links</p>
          <div className="space-y-2 text-sm text-white/80">
            {nav.map((n) => (
              <p key={n} className="cursor-pointer hover:text-[#0092fb]">
                {n}
              </p>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="font-semibold mb-3">Contact</p>
          <div className="space-y-3 text-sm">
            <a href="tel:+919525525552" className="flex items-center gap-2 hover:text-[#0092fb]">
              <Phone size={16} className="text-[#0092fb]" />
              +91 9 52 552 5552
            </a>
            <a
              href="mailto:shigoelitetourism@gmail.com"
              className="flex items-center gap-2 hover:text-[#0092fb]"
            >
              <Mail size={16} className="text-[#0092fb]" />
              shigoelitetourism@gmail.com
            </a>
            <a
              href="https://wa.me/919525525552"
              className="flex items-center gap-2 hover:text-[#0092fb]"
            >
              <MessageCircle size={16} className="text-[#0092fb]" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-white/60">
        © {new Date().getFullYear()} ShiGO Elite Tourism. All rights reserved.
      </div>
    </footer>
  );
}
