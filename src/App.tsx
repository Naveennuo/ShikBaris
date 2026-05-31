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

import { Kerala, KeralaDistrictPage } from "./pages/Kerala";
import { Karnataka, KarnatakaDistrictPage } from "./pages/Karnataka";
import { TamilNadu, DistrictPage } from "./pages/TamilNadu";
import {
  AndhraPradesh,
  AndhraPradeshDistrictPage,
} from "./pages/AndhraPradesh";
import { Puducherry, PuducherryDistrictPage } from "./pages/Puducherry";
import { Goa, GoaDistrictPage } from "./pages/Goa";
import {
  Telangana,
  TelanganaDistrictPage,
} from "./pages/Telangana";

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
          <Route path="/karnataka" element={<Karnataka />} />
          <Route path="/karnataka/:districtSlug" element={<KarnatakaDistrictPage />} />
          <Route path="/andhrapradesh" element={<AndhraPradesh />} />
          <Route path="/andhrapradesh/:districtSlug" element={<AndhraPradeshDistrictPage />} />
          <Route path="/tamilnadu" element={<TamilNadu />} />
          <Route path="/tamilnadu/:districtSlug" element={<DistrictPage />} />
          <Route path="/puducherry" element={<Puducherry />} />
          <Route path="/puducherry/:districtSlug" element={<PuducherryDistrictPage />} />
          <Route path="/goa" element={<Goa />} />
          <Route path="/goa/:districtSlug" element={<GoaDistrictPage />} />
          <Route path="/telangana" element={<Telangana />} />
          <Route path="/telangana/:districtSlug" element={<TelanganaDistrictPage />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
