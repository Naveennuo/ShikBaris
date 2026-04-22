import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type Sight = { title: string; img: string };

type District = {
  title: string;
  slug: string;
  banner: string;
  sights: Sight[];
};

const keralaBanner = new URL(
  "../assets/states/Kerala.jpg",
  import.meta.url
).href;

const modules = import.meta.glob("../assets/kerala/**/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const DISTRICT_TITLES = [
  "Thiruvananthapuram",
  "Alappuzha",
  "Ernakulam",
  "Wayanad",
  "Kannur",
  "Palakkad",
  "Idukki",
  "Kozhikode",
  "Kollam",
  "Kottayam",
  "Malappuram",
  "Thrissur",
  "Kasaragod",
  "Pathanamthitta",
] as const;

const normalize = (path: string) => path.replace(/\\/g, "/").toLowerCase();

const cleanName = (name: string) =>
  name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const createSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const districtMap: Record<string, District> = {};

DISTRICT_TITLES.forEach((title) => {
  const slug = createSlug(title);

  districtMap[slug] = {
    title,
    slug,
    banner: keralaBanner,
    sights: [],
  };
});

Object.entries(modules).forEach(([path, src]) => {
  const normalizedPath = normalize(path);

  if (!normalizedPath.includes("/1district/")) return;

  const fileName = normalizedPath.split("/").pop() || "";
  const slug = fileName.replace(/\.[^.]+$/, "");

  if (!districtMap[slug]) return;

  districtMap[slug].banner = src;
});

Object.entries(modules).forEach(([path, src]) => {
  const normalizedPath = normalize(path);

  if (normalizedPath.includes("/1district/")) return;

  const splitPath = normalizedPath.split("/kerala/")[1];
  if (!splitPath) return;

  const parts = splitPath.split("/");
  const folder = parts[0];

  if (!districtMap[folder]) return;

  const fileName = parts.pop() || "";

  districtMap[folder].sights.push({
    title: cleanName(fileName),
    img: src,
  });
});

const DISTRICTS = Object.values(districtMap);

export const Kerala: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="relative h-[360px] w-full overflow-hidden">
        <img
          src={keralaBanner}
          alt="Kerala"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <h1 className="text-4xl font-bold tracking-wide md:text-6xl">Kerala</h1>
          <p className="mt-5 max-w-3xl text-lg md:text-xl">
            Explore backwaters, hills, beaches, wildlife and heritage districts
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DISTRICTS.map((district) => (
            <Link
              key={district.slug}
              to={`/kerala/${district.slug}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-md transition duration-500 hover:shadow-2xl">
                <div className="h-[240px] overflow-hidden">
                  <img
                    src={district.banner}
                    alt={district.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 transition duration-300 group-hover:bg-[#007bff]">
                  <ArrowRight
                    size={18}
                    className="text-black transition group-hover:-rotate-45 group-hover:text-white"
                  />
                </div>

                <div className="py-5 text-center">
                  <h3 className="text-lg font-semibold text-[#121316]">
                    {district.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const KeralaDistrictPage: React.FC = () => {
  const { districtSlug } = useParams();

  const district = DISTRICTS.find((entry) => entry.slug === districtSlug);

  if (!district) {
    return (
      <div className="min-h-screen px-6 pt-24">
        <h1 className="text-2xl font-bold">District not found</h1>

        <Link
          to="/kerala"
          className="mt-6 inline-flex rounded-full bg-black px-6 py-2 text-sm font-semibold text-white"
        >
          {"<- Kerala"}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="relative h-[280px] w-full overflow-hidden">
        <img
          src={district.banner}
          alt={district.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="text-3xl font-bold md:text-5xl">{district.title}</h1>

          <Link
            to="/kerala"
            className="mt-6 rounded-full bg-white px-6 py-2 text-sm font-semibold text-black hover:bg-gray-200"
          >
            {"<- Kerala"}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <h2 className="mb-10 text-2xl font-bold md:text-3xl">
          Top sights in {district.title}
        </h2>

        {district.sights.length === 0 ? (
          <p className="text-gray-500">
            Add images to
            {" "}
            <span className="font-medium">{`src/assets/kerala/${district.slug}`}</span>
            {" "}
            to show this district&apos;s sights.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {district.sights.map((sight, index) => (
              <div
                key={`${sight.title}-${index}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-2xl"
              >
                <div className="h-[220px] overflow-hidden">
                  <img
                    src={sight.img}
                    alt={sight.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="py-5 text-center">
                  <h3 className="text-md font-semibold">{sight.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
