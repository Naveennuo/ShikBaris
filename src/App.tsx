import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./sections/Header";
import Footer from "./sections/Footer";

import MainHero from "./sections/MainHero";
import TopSights from "./sections/TopSights";
import TourPackages from "./sections/TourPackages";
import WhyShikBaris from "./sections/WhyShikBaris";
import DealsWeekend from "./sections/ExplorePackages";
import HotelBooking from "./sections/HotelBooking";
import Cars from "./sections/Cars";
import TicketBooking from "./sections/TicketBooking";
import RatingReviews from "./sections/RatingReviews";

/* ✅ SINGLE FILE IMPORT */
import { Kerala, KeralaDistrictPage } from "./pages/Kerala";
import { TamilNadu, DistrictPage } from "./pages/TamilNadu";

/* ---------- Home Page ---------- */
const Home = () => {
  return (
    <>
      <MainHero />
      <TourPackages />
      <TopSights />
      <WhyShikBaris />
      <DealsWeekend />
      <HotelBooking />
      <Cars />
      <TicketBooking />
      <RatingReviews />
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-white">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/kerala" element={<Kerala />} />
          <Route path="/kerala/:districtSlug" element={<KeralaDistrictPage />} />
          <Route path="/tamilnadu" element={<TamilNadu />} />
          <Route path="/tamilnadu/:districtSlug" element={<DistrictPage />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
