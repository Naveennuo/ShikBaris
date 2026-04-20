import React from "react";

type TourPackage = {
  id: number;
  route: string;
  days: string;
  image: string;
};

const images = {
  allappy: new URL("../assets/Allappy Boat House.jpeg", import.meta.url).href,
  kerala: new URL("../assets/Kerala.jpg", import.meta.url).href,
  kodaikanal: new URL("../assets/tamilnadu/1district/kodaikanal.jpg", import.meta.url).href,
  coimbatore: new URL("../assets/tamilnadu/1district/coimbatore.jpg", import.meta.url).href,
  thanjavur: new URL("../assets/tamilnadu/1district/thanjavur.jpg", import.meta.url).href,
  kumbakonam: new URL("../assets/tamilnadu/1district/kumbakonam.jpg", import.meta.url).href,
  mahabalipuram: new URL("../assets/tamilnadu/1district/mahabalipuram.jpg", import.meta.url).href,
  karnataka: new URL("../assets/Karnataka.jpg", import.meta.url).href,
  kanyakumari: new URL("../assets/tamilnadu/kanyakumari/kanyakumari-beach.jpg", import.meta.url).href,
  palani: new URL("../assets/tamilnadu/1district/palani.jpg", import.meta.url).href,
  palakkad: new URL("../assets/tamilnadu/coimbatore/palakkad-fort.jpg", import.meta.url).href,
  kanchipuram: new URL("../assets/tamilnadu/1district/kanchipuram.jpg", import.meta.url).href,
  rameshwaram: new URL("../assets/tamilnadu/district/rameshwaram.jpg", import.meta.url).href,
  tirupati: new URL("../assets/tamilnadu/kanyakumari/tirupati-balaji-temple.webp", import.meta.url).href,
  valparai: new URL("../assets/tamilnadu/1district/valparai.jpg", import.meta.url).href,
  courtallam: new URL("../assets/tamilnadu/district/courtallam.jpg", import.meta.url).href,
  packages: new URL("../assets/Tour Packages.jpg", import.meta.url).href,
  temple: new URL("../assets/Temple Tour.jpg", import.meta.url).href,
};

const packages: TourPackage[] = [
  {
    id: 1,
    route: "Madurai, Rameshwaram, Kanyakumari, Trivandrum",
    days: "5 Days",
    image: images.kanyakumari,
  },
  {
    id: 2,
    route: "Trivandrum, Varkala, Allappy, Cochin",
    days: "5 Days",
    image: images.allappy,
  },
  {
    id: 3,
    route: "Trivandrum, Allappy, Thekkady, Munnar, Cochin",
    days: "7 Days",
    image: images.kerala,
  },
  {
    id: 4,
    route: "Cochin, Munnar, Madurai",
    days: "4 Days",
    image: images.kerala,
  },
  {
    id: 5,
    route: "Madurai, Kodaikanal",
    days: "3 Days",
    image: images.kodaikanal,
  },
  {
    id: 6,
    route: "Madurai, Kodaikanal, Ooty, Coimbatore",
    days: "7 Days",
    image: images.kodaikanal,
  },
  {
    id: 7,
    route: "Coimbatore, Ooty, Mysore",
    days: "6 Days",
    image: images.coimbatore,
  },
  {
    id: 8,
    route: "Madurai, Trichy, Thanjavur",
    days: "4 Days",
    image: images.thanjavur,
  },
  {
    id: 9,
    route: "Trichy, Thanjavur, Kumbakonam, Chidambaram",
    days: "5 Days",
    image: images.kumbakonam,
  },
  {
    id: 10,
    route: "Chennai, Mahabalipuram, Pondicherry, Thanjavur, Trichy, Madurai",
    days: "7 Days",
    image: images.mahabalipuram,
  },
  {
    id: 11,
    route: "Bangalore, Mysore, Coorg, Mangalore",
    days: "6 Days",
    image: images.karnataka,
  },
  {
    id: 12,
    route: "Madurai, Palani, Coimbatore",
    days: "3 Days",
    image: images.palani,
  },
  {
    id: 13,
    route: "Cochin, Guruvayur, Wayanad, Vagamon, Thekkady, Madurai",
    days: "7 Days",
    image: images.kerala,
  },
  {
    id: 14,
    route: "Coimbatore, Palakkad, Ooty, Madurai",
    days: "5 Days",
    image: images.palakkad,
  },
  {
    id: 15,
    route: "Chennai, Kanchipuram, Thiruvannamalai, Trichy",
    days: "5 Days",
    image: images.kanchipuram,
  },
  {
    id: 16,
    route: "Chennai, Tirupati, Chennai",
    days: "3 Days",
    image: images.tirupati,
  },
  {
    id: 17,
    route: "Madurai, Rameshwaram, Thanjavur, Trichy",
    days: "6 Days",
    image: images.rameshwaram,
  },
  {
    id: 18,
    route: "Coimbatore, Pollachi, Valparai, Parambikulam, Madurai",
    days: "5 Days",
    image: images.valparai,
  },
  {
    id: 19,
    route: "Madurai, Courtallam, Thenmala, Jadayu Earth Centre, Trivandrum",
    days: "4 Days",
    image: images.courtallam,
  },
  {
    id: 20,
    route: "Sabarimala Temple Tour Available",
    days: "3 Days",
    image: images.temple,
  },
];

const firstRow = packages.slice(0, 10);
const secondRow = packages.slice(10);

function TourRow({
  items,
  direction,
}: {
  items: TourPackage[];
  direction: "left" | "right";
}) {
  const duplicatedItems = [...items, ...items];

  return (
    <div className="tour-packages__row">
      <div
        className={`tour-packages__track ${
          direction === "left" ? "tour-packages__track--left" : "tour-packages__track--right"
        }`}
      >
        {duplicatedItems.map((pkg, index) => (
          <article key={`${pkg.id}-${index}`} className="tour-packages__card">
            <img src={pkg.image} alt={pkg.route} className="tour-packages__image" />
            <div className="tour-packages__overlay" />
            <div className="tour-packages__content">
              <span className="tour-packages__days">{pkg.days}</span>
              <h3 className="tour-packages__title">{pkg.route}</h3>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function TourPackages() {
  return (
    <section className="w-full bg-[#f7fafc] py-14 md:py-18">
      <div className="w-full">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="px-4 text-[32px] font-semibold text-[#121316] md:px-8 md:text-[40px]">
            Tour packages
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          <TourRow items={firstRow} direction="left" />
          <TourRow items={secondRow} direction="right" />
        </div>
      </div>

      <style>
        {`
          .tour-packages__row {
            position: relative;
            overflow: hidden;
            width: 100%;
            padding: 4px 0;
          }

          .tour-packages__track {
            display: flex;
            width: max-content;
            gap: 24px;
          }

          .tour-packages__track--left {
            animation: tourPackagesLeft 42s linear infinite;
          }

          .tour-packages__track--right {
            animation: tourPackagesRight 42s linear infinite;
          }

          .tour-packages__card {
            position: relative;
            width: 320px;
            min-width: 320px;
            height: 300px;
            overflow: hidden;
            border-radius: 24px;
            background: #0f172a;
            box-shadow: 0 20px 45px rgba(15, 23, 42, 0.16);
          }

          .tour-packages__image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.45s ease;
          }

          .tour-packages__card:hover .tour-packages__image {
            transform: scale(1.08);
          }

          .tour-packages__overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(10, 22, 40, 0.78) 0%, rgba(10, 22, 40, 0.2) 55%, rgba(10, 22, 40, 0.5) 100%);
          }

          .tour-packages__content {
            position: absolute;
            inset: 0 auto auto 0;
            width: 100%;
            padding: 18px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            color: #ffffff;
          }

          .tour-packages__days {
            width: fit-content;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.16);
            padding: 7px 12px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            backdrop-filter: blur(8px);
          }

          .tour-packages__title {
            max-width: 230px;
            font-size: 22px;
            font-weight: 700;
            line-height: 1.3;
            text-wrap: balance;
          }

          .tour-packages__row:hover .tour-packages__track {
            animation-play-state: paused;
          }

          @keyframes tourPackagesLeft {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(calc(-50% - 10px));
            }
          }

          @keyframes tourPackagesRight {
            from {
              transform: translateX(calc(-50% - 10px));
            }

            to {
              transform: translateX(0);
            }
          }

          @media (max-width: 768px) {
            .tour-packages__card {
              width: 260px;
              min-width: 260px;
              height: 270px;
            }

            .tour-packages__title {
              max-width: 190px;
              font-size: 19px;
            }

            .tour-packages__track--left,
            .tour-packages__track--right {
              animation-duration: 34s;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .tour-packages__track--left,
            .tour-packages__track--right {
              animation: none;
            }
          }
        `}
      </style>
    </section>
  );
}
