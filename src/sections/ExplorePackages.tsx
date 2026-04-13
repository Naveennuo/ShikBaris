import React from "react";

/* images (add manually) */
const img = {
  tour: new URL("../assets/Tour Packages.jpg", import.meta.url).href,
  hills: new URL("../assets/Hills Station.webp", import.meta.url).href,
  honeymoon: new URL("../assets/Honeymoon Trip.jpg", import.meta.url).href,
  temple: new URL("../assets/Temple Tour.jpg", import.meta.url).href,
  taxi: new URL("../assets/Local Taxi Services.png", import.meta.url).href,
  driver: new URL("../assets/Acting Drivers.png", import.meta.url).href,
  backwaters: new URL("../assets/Poovar Backwaters.jpg", import.meta.url).href,
};

const deals = [
  { id: 1, title: "Tour Packages", location: "India", image: img.tour },
  { id: 2, title: "Hills Station", location: "India", image: img.hills },
  { id: 3, title: "Honeymoon Packages", location: "India", image: img.honeymoon },
  { id: 4, title: "Temple Tour", location: "India", image: img.temple },
];

export default function DealsWeekend() {
  return (
    <section className="bg-[#f3f4f6] py-16">
      <div className="max-w-[1232px] mx-auto px-4">
        <h2 className="text-[32px] md:text-[40px] font-semibold text-[#121316] mb-8">
          Explore Packages
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map(({ id, title, location, image }) => (
            <div key={id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img src={image} alt={title} className="h-[200px] w-full object-cover" />
              <div className="p-4">
                <p className="text-lg font-semibold text-[#121316]">{title}</p>
                <p className="text-sm text-gray-500">{location}</p>
                <button className="mt-4 w-full bg-[#0092FB] text-white py-2 rounded-lg font-medium hover:bg-[#007ad6] transition">
                  Explore More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
