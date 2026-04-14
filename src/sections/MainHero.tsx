import { useEffect, useState } from "react";
import Header from "./Header";
import InternationalTours from "./InternationalTours";

const imgs = [
  new URL("../assets/HeroBanner1.jpg", import.meta.url).href,
  new URL("../assets/HeroBanner2.jpg", import.meta.url).href,
  new URL("../assets/HeroBanner3.jpg", import.meta.url).href,
];

export default function MainHero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % imgs.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <section className="relative h-[85vh] md:h-[730px] overflow-hidden rounded-b-[28px]">
        {imgs.map((img, n) => (
          <img key={n} src={img} className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
            n === i ? "opacity-100" : "opacity-0"
          }`} />
        ))}

        <div className="absolute inset-0 bg-black/40" />
        <Header />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-7xl font-extrabold">Travel more!, Spend less!</h1>
          <p className="mt-4 text-lg md:text-2xl max-w-xl">
            Find unique stays across hotels, villas, and more.
          </p>
          <button className="mt-8 px-8 py-3 bg-[#0092fb] rounded-xl">Explore Now</button>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {imgs.map((_, n) => (
            <span key={n} className={`h-2 rounded-full ${
              n === i ? "w-5 bg-white" : "w-2 bg-white/50"
            }`} />
          ))}
        </div>
      </section>
      <InternationalTours />
    </>
  );
}
