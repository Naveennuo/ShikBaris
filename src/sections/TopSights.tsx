import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// ✅ AUTO IMPORT IMAGES
const stateImages = import.meta.glob(
  "../assets/states/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  }
) as Record<string, string>;

// ✅ GRID SPAN PATTERN (UNCHANGED)
const spanPattern = [3, 3, 2, 2, 2];

const TopSights: React.FC = () => {
  const navigate = useNavigate();

  // ✅ AUTO BUILD DATA FROM FILES
  const sights = Object.entries(stateImages).map(([path, src], index) => {
    const file = path.split("/").pop() || "";
    const name = file.replace(/\.[^.]+$/, "");

    const title = name
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    // 👉 clean slug for routing
    const slug = name.toLowerCase().replace(/\s+/g, "");

    return {
      title,
      slug,
      img: src,
      span: spanPattern[index % spanPattern.length],
    };
  });

  return (
    <section style={{ width: "100%", padding: 40, boxSizing: "border-box" }}>
      <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>
        Top Sights to See
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 20,
        }}
      >
        {sights.map((s, i) => (
          <div
            key={i}
            style={{
              gridColumn: `span ${s.span}`,
              height: 260,
              borderRadius: 18,
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
            }}
            className="top-sight-card"
            onClick={() => navigate(`/${s.slug}`)} // ✅ AUTO ROUTE
          >
            <img
              src={s.img}
              alt={s.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.5s ease",
              }}
              className="top-sight-img"
            />

            <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                background: "rgba(0,0,0,0.5)",
                padding: "8px 16px",
                borderRadius: 12,
                backdropFilter: "blur(4px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: 600,
                  textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                }}
              >
                {s.title}
              </span>
            </div>

            <div
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                width: 40,
                height: 40,
                background: "rgba(255,255,255,0.9)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.3s ease",
                transformOrigin: "center center",
              }}
              className="redirect-arrow-btn"
            >
              <ArrowRight size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* ✅ SAME CSS (UNCHANGED) */}
      <style>
        {`
          .top-sight-card:hover > .top-sight-img {
            transform: scale(1.06);
          }

          .redirect-arrow-btn {
            transform: rotate(0deg);
            transform-origin: center center;
            transition: background-color 0.3s ease;
          }

          .top-sight-card:hover .redirect-arrow-btn {
            background-color: #007bff !important;
          }

          .redirect-arrow-btn svg {
            color: #000;
            transform: rotate(0deg);
            transition: transform 0.3s ease, color 0.3s ease;
          }

          .top-sight-card:hover .redirect-arrow-btn svg {
            transform: rotate(-45deg);
            color: #fff !important;
          }

          @media (max-width: 1024px) {
            section div[style*="grid"] {
              grid-template-columns: repeat(4, 1fr) !important;
            }
          }

          @media (max-width: 640px) {
            section {
              padding: 20px !important;
            }

            section div[style*="grid"] {
              grid-template-columns: repeat(1, 1fr) !important;
            }

            .top-sight-card {
              grid-column: span 1 !important;
              height: 260px !important;
            }

            .top-sight-card img {
              height: 100% !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default TopSights;