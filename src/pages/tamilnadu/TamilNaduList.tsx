import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/* ================== BANNER ================== */
const Banner = new URL("../../assets/Tamilnadu.jpg", import.meta.url).href;

/* ================== DISTRICT IMAGES ================== */
const Nilgiris = new URL("../../assets/tamilnadu/district/nilgiris.jpg", import.meta.url).href;
const Kanchipuram = new URL("../../assets/tamilnadu/district/kanchipuram.jpg", import.meta.url).href;
const Coimbatore = new URL("../../assets/tamilnadu/district/coimbatore.jpg", import.meta.url).href;
const Chennai = new URL("../../assets/tamilnadu/district/chennai.jpg", import.meta.url).href;
const Mahabalipuram = new URL("../../assets/tamilnadu/district/mahabalipuram.jpg", import.meta.url).href;
const Thanjavur = new URL("../../assets/tamilnadu/district/thanjavur.jpg", import.meta.url).href;
const Kodaikanal = new URL("../../assets/tamilnadu/district/kodaikanal.jpg", import.meta.url).href;
const Trichy = new URL("../../assets/tamilnadu/district/trichy.jpg", import.meta.url).href;
const Thiruvannamalai = new URL("../../assets/tamilnadu/district/thiruvannamalai.jpg", import.meta.url).href;
const Courtallam = new URL("../../assets/tamilnadu/district/courtallam.jpg", import.meta.url).href;
const TheniandCumbum = new URL("../../assets/tamilnadu/district/theniandcumbum.jpg", import.meta.url).href;
const Kanyakumari = new URL("../../assets/tamilnadu/district/kanyakumari.jpg", import.meta.url).href;
const KolliMalaiHills = new URL("../../assets/tamilnadu/district/kollimalaihills.jpg", import.meta.url).href;
const Salem = new URL("../../assets/tamilnadu/district/salem.jpg", import.meta.url).href;
const Yercaud = new URL("../../assets/tamilnadu/district/yercaud.webp", import.meta.url).href;
const Madurai = new URL("../../assets/tamilnadu/district/madurai.jpg", import.meta.url).href;
const Hogenakkal = new URL("../../assets/tamilnadu/district/hogenakkal.jpg", import.meta.url).href;
const Pollachi = new URL("../../assets/tamilnadu/district/pollachi.webp", import.meta.url).href;
const Valparai = new URL("../../assets/tamilnadu/district/valparai.jpg", import.meta.url).href;
const Parambikulam = new URL("../../assets/tamilnadu/district/parambikulam.webp", import.meta.url).href;
const Palani = new URL("../../assets/tamilnadu/district/palani.jpg", import.meta.url).href;
const Megamalai = new URL("../../assets/tamilnadu/district/megamalai.jpg", import.meta.url).href;
const Rameshwaram = new URL("../../assets/tamilnadu/district/rameshwaram.jpg", import.meta.url).href;
const Vellore = new URL("../../assets/tamilnadu/district/vellore.jpg", import.meta.url).href;
const Thoothukudi = new URL("../../assets/tamilnadu/district/thoothukudi.jpg", import.meta.url).href;
const Kumbakonam = new URL("../../assets/tamilnadu/district/kumbakonam.jpg", import.meta.url).href;
const Velankanni = new URL("../../assets/tamilnadu/district/velankanni.jpg", import.meta.url).href;

/* ================== DATA ================== */
const districts = [
  { name: "Nilgiris (Ooty)", slug: "nilgiris", img: Nilgiris },
  { name: "Kanchipuram", slug: "kanchipuram", img: Kanchipuram },
  { name: "Coimbatore", slug: "coimbatore", img: Coimbatore },
  { name: "Chennai", slug: "chennai", img: Chennai },
  { name: "Mahabalipuram", slug: "mahabalipuram", img: Mahabalipuram },
  { name: "Thanjavur", slug: "thanjavur", img: Thanjavur },
  { name: "Kodaikanal", slug: "kodaikanal", img: Kodaikanal },
  { name: "Trichy", slug: "trichy", img: Trichy },
  { name: "Thiruvannamalai", slug: "thiruvannamalai", img: Thiruvannamalai },
  { name: "Courtallam", slug: "courtallam", img: Courtallam },
  { name: "Theni & Cumbum", slug: "theniandcumbum", img: TheniandCumbum },
  { name: "Kanyakumari", slug: "kanyakumari", img: Kanyakumari },
  { name: "Kolli Malai Hills", slug: "kollimalaihills", img: KolliMalaiHills },
  { name: "Salem", slug: "salem", img: Salem },
  { name: "Yercaud", slug: "yercaud", img: Yercaud },
  { name: "Madurai", slug: "madurai", img: Madurai },
  { name: "Hogenakkal", slug: "hogenakkal", img: Hogenakkal },
  { name: "Pollachi", slug: "pollachi", img: Pollachi },
  { name: "Valparai", slug: "valparai", img: Valparai },
  { name: "Parambikulam", slug: "parambikulam", img: Parambikulam },
  { name: "Palani", slug: "palani", img: Palani },
  { name: "Megamalai", slug: "megamalai", img: Megamalai },
  { name: "Rameshwaram", slug: "rameshwaram", img: Rameshwaram },
  { name: "Vellore", slug: "vellore", img: Vellore },
  { name: "Thoothukudi", slug: "thoothukudi", img: Thoothukudi },
  { name: "Kumbakonam", slug: "kumbakonam", img: Kumbakonam },
  { name: "Velankanni", slug: "velankanni", img: Velankanni },
];

export default function TamilNadu() {
  return (
    <div className="bg-white min-h-screen pt-20">
      {/* ================== HERO BANNER ================== */}
      <div className="relative w-full h-[360px] md:h-[360px] overflow-hidden">
        <img
          src={Banner}
          alt="Tamil Nadu"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-wide">Tamil Nadu</h1>
          <p className="mt-5 text-lg md:text-xl max-w-3xl">
            Discover temples, misty hills, beaches, heritage cities and timeless culture.
          </p>
        </div>
      </div>

      {/* ================== DISTRICT GRID ================== */}
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {districts.map((district) => (
            <Link key={district.slug} to={`/tamilnadu/${district.slug}`} className="group">
              <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-500 bg-white">
                <div className="h-[240px] overflow-hidden">
                  <img
                    src={district.img}
                    alt={district.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    loading="lazy"
                  />
                </div>

                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center transition duration-300 group-hover:bg-[#007bff]">
                  <ArrowRight size={18} className="text-[#000] transition duration-300 transform group-hover:-rotate-45 group-hover:text-white" />
                </div>

                <div className="py-5 text-center">
                  <h3 className="text-lg font-semibold text-[#121316]">{district.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
