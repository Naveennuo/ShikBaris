import React from "react";

/* ---------------- Images ---------------- */
const imgs = {
  Swift: new URL("../assets/vehicles/maruti-swift.jpeg", import.meta.url).href,
  Etios: new URL("../assets/vehicles/etios.png", import.meta.url).href,
  Ertiga: new URL("../assets/vehicles/ertiga.jpg", import.meta.url).href,
  Carens: new URL("../assets/vehicles/kia-carens.jpg", import.meta.url).href,
  Rumion: new URL("../assets/vehicles/toyota-rumion.jpg", import.meta.url).href,
  Innova: new URL("../assets/vehicles/innova.jpg", import.meta.url).href,
  Crysta: new URL("../assets/vehicles/crysta.jpg", import.meta.url).href,
  Hycross: new URL("../assets/vehicles/toyota-hycross.png", import.meta.url).href,
  Tempo14: new URL("../assets/vehicles/tempo-14.webp", import.meta.url).href,
  Tempo18: new URL("../assets/vehicles/tempo-18.jpg", import.meta.url).href,
  Urbania12: new URL("../assets/vehicles/urbania-12.jpg", import.meta.url).href,
  Urbania16: new URL("../assets/vehicles/urbania-16.jpg", import.meta.url).href,
  Coach: new URL("../assets/vehicles/mini-bus.png", import.meta.url).href,
};

/* ---------------- Vehicles (STRICT ORDER) ---------------- */
const vehicles: {
  name: string;
  category: string;
  seats: string;
  image: string;
}[] = [     // 1
  { name: "Maruti Swift", category: "Hatchback", seats: "4+1", image: imgs.Swift },         // 2
  { name: "Toyota Etios", category: "Sedan", seats: "4+1", image: imgs.Etios },              // 3
  { name: "Maruti Ertiga", category: "MPV", seats: "7+1", image: imgs.Ertiga },              // 4
  { name: "Kia Carens", category: "MPV", seats: "7+1", image: imgs.Carens },                 // 5
  { name: "Toyota Rumion", category: "MPV", seats: "7+1", image: imgs.Rumion },              // 6
  { name: "Toyota Innova", category: "SUV", seats: "7+1", image: imgs.Innova },              // 7
  { name: "Toyota Crysta", category: "Premium SUV", seats: "7+1", image: imgs.Crysta },     // 8
  { name: "Toyota Hycross", category: "Hybrid SUV", seats: "7+1", image: imgs.Hycross },    // 9

  { name: "Tempo Traveller", category: "AC / Non-AC", seats: "14+1", image: imgs.Tempo14 }, // 10
  { name: "Tempo Traveller", category: "AC", seats: "18+1", image: imgs.Tempo18 },          // 11
  { name: "Force Urbania", category: "Luxury Van", seats: "12+1", image: imgs.Urbania12 },  // 12
  { name: "Force Urbania", category: "Luxury Van", seats: "16+1", image: imgs.Urbania16 },  // 13

  { name: "Mini Bus (Coach)", category: "AC", seats: "21+1", image: imgs.Coach },                       // 14         // 15
];

/* ---------------- Component ---------------- */
export default function VehicleTariffCards() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-[1240px] mx-auto px-4">
        <h2 className="text-[28px] md:text-[36px] font-semibold mb-8">
          Car Rental Tariff
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div
              key={`${v.name}-${v.seats}`}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <img
                src={v.image}
                alt={v.name}
                className="h-[200px] w-full object-cover"
              />

              <div className="p-5">
                <h3 className="text-lg font-semibold">{v.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {v.category} • {v.seats}
                </p>

                <button className="w-full bg-[#009387] text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
