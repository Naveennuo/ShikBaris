/* ===========================
   ✅ App.tsx (FULL)
   =========================== */
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./sections/Header";
import Footer from "./sections/Footer";

import MainHero from "./sections/MainHero";
import TopSights from "./sections/TopSights";
import TourPackages from "./sections/TourPackages";
import WhyShiGO from "./sections/WhyShiGO";
import DealsWeekend from "./sections/ExplorePackages";
import HotelBooking from "./sections/HotelBooking";
import Cars from "./sections/Cars";
import TicketBooking from "./sections/TicketBooking";
import RatingReviews from "./sections/RatingReviews";

/* Tamil Nadu Pages */
import TamilNaduList from "./pages/tamilnadu/TamilNaduList";
import DistrictPage from "./pages/tamilnadu/DistrictPage";



/* ---------- Home Page Layout ---------- */
const Home = () => {
  return (
    <>
      <MainHero />
      <TourPackages />
      <TopSights />
      <WhyShiGO />
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
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Tamil Nadu Main */}
        <Route path="/tamilnadu" element={<TamilNaduList />} />
        <Route path="/tamilnadu/:districtSlug" element={<DistrictPage />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
