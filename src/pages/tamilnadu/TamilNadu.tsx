import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/* ================== AUTO IMPORT ================== */

const tamilNaduBanner = new URL(
  "../../assets/states/Tamilnadu.jpg",
  import.meta.url
).href;

const modules = import.meta.glob(
  "../../assets/tamilnadu/**/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  }
) as Record<string, string>;

/* ================== HELPERS ================== */

const cleanName = (name: string) =>
  name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const normalize = (path: string) =>
  path.replace(/\\/g, "/").toLowerCase();

/* ================== BUILD DATA ================== */

type Sight = { title: string; img: string };

type District = {
  title: string;
  slug: string;
  banner: string;
  sights: Sight[];
};

const districtMap: Record<string, District> = {};

/* ================== STEP 1: GET DISTRICT BANNERS ================== */
/* 🔥 using "1district" (your actual folder) */

Object.entries(modules).forEach(([path, src]) => {
  const p = normalize(path);

  if (p.includes("/1district/")) {
    const file = p.split("/").pop() || "";
    const slug = file.replace(/\.[^.]+$/, "");

    districtMap[slug] = {
      title: cleanName(slug),
      slug,
      banner: src,
      sights: [],
    };
  }
});

/* ================== STEP 2: ATTACH SIGHTS ================== */

Object.entries(modules).forEach(([path, src]) => {
  const p = normalize(path);

  if (p.includes("/1district/")) return;

  const split = p.split("/tamilnadu/")[1];
  if (!split) return;

  const parts = split.split("/");
  const folder = parts[0]; // 👈 chennai, coimbatore, etc.

  if (!districtMap[folder]) return;

  const file = parts.pop() || "";

  districtMap[folder].sights.push({
    title: cleanName(file),
    img: src,
  });
});

/* ================== FINAL ARRAY ================== */

const DISTRICTS = Object.values(districtMap);

/* ================== LIST PAGE ================== */

export const TamilNadu: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pt-20">
      {/* ===== HERO ===== */}
      <div className="relative w-full h-[360px] overflow-hidden">
        <img
          src={tamilNaduBanner}
          alt="Tamil Nadu"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-wide">
            Tamil Nadu
          </h1>
          <p className="mt-5 text-lg md:text-xl max-w-3xl">
            Discover temples, hills, beaches & culture
          </p>
        </div>
      </div>

      {/* ===== GRID ===== */}
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        {DISTRICTS.length === 0 ? (
          <p className="text-center text-gray-500">
            No districts found (check folder names)
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DISTRICTS.map((d) => (
              <Link
                key={d.slug}
                to={`/tamilnadu/${d.slug}`}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-500 bg-white">
                  <div className="h-[240px] overflow-hidden">
                    <img
                      src={d.banner}
                      alt={d.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      loading="lazy"
                    />
                  </div>

                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center transition duration-300 group-hover:bg-[#007bff]">
                    <ArrowRight
                      size={18}
                      className="text-black group-hover:text-white group-hover:-rotate-45 transition"
                    />
                  </div>

                  <div className="py-5 text-center">
                    <h3 className="text-lg font-semibold text-[#121316]">
                      {d.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================== DETAIL PAGE ================== */

export const DistrictPage: React.FC = () => {
  const { districtSlug } = useParams();

  const district = DISTRICTS.find((d) => d.slug === districtSlug);

  if (!district) {
    return (
      <div className="min-h-screen pt-24 px-6">
        <h1 className="text-2xl font-bold">District not found</h1>

        <Link
          to="/tamilnadu"
          className="inline-flex mt-6 px-6 py-2 bg-black text-white rounded-full text-sm font-semibold"
        >
          ← Tamil Nadu
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* ===== BANNER ===== */}
      <div className="relative w-full h-[280px] overflow-hidden">
        <img
          src={district.banner}
          alt={district.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-3xl md:text-5xl font-bold">
            {district.title}
          </h1>

          <Link
            to="/tamilnadu"
            className="mt-6 px-6 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-200"
          >
            ← Tamil Nadu
          </Link>
        </div>
      </div>

      {/* ===== SIGHTS ===== */}
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-10">
          Top sights in {district.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {district.sights.map((s, i) => (
            <div
              key={i}
              className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition bg-white"
            >
              <div className="h-[220px] overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
              </div>

              <div className="py-5 text-center">
                <h3 className="text-md font-semibold">{s.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
