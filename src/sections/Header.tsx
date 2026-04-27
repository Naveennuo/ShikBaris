import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Phone, Mail, Menu, X, ArrowUp, MessageCircle } from "lucide-react";

/* Assets */
const logo = new URL("../assets/ShikBaris_Logo.png", import.meta.url).href;
const whatsappLogo = new URL("../assets/whatsapp.svg", import.meta.url).href;

const nav = ["Destinations", "Our Advantages", "Bank Details", "Terms & Conditions"];

const PHONE = "+919525525552";
const MAIL = "booking@shikbaris.com";
const TEL = `tel:${PHONE}`;
const EMAIL = `mailto:${MAIL}`;
const WA = `https://wa.me/${PHONE.replace("+", "")}`;
const POP_KEY = "shikbaris_whatsapp_popup_seen_v3";

export default function HeaderWithWhatsApp() {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const [showWaPopup, setShowWaPopup] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  // Plan form - 7 mandatory fields + optional notes
  const [fullName, setFullName] = useState("");
  const [phNo, setPhNo] = useState("");
  const [email, setEmail] = useState("");
  const [stateCity, setStateCity] = useState("");
  const [travellers, setTravellers] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [departureCity, setDepartureCity] = useState("");
  const [requirements, setRequirements] = useState("");

  const waMsg = useMemo(() => {
    const msg =
      `Full Name: ${fullName || "-"}\n` +
      `Phone: ${phNo || "-"}\n` +
      `Email: ${email || "-"}\n` +
      `State/City: ${stateCity || "-"}\n` +
      `No. of Travellers: ${travellers || "-"}\n` +
      `Arrival City: ${arrivalCity || "-"}\n` +
      `Departure City: ${departureCity || "-"}\n` +
      `\nTravel Requirements:\n${requirements || "-"}`;
    return msg;
  }, [fullName, phNo, email, stateCity, travellers, arrivalCity, departureCity, requirements]);

  const waDefault = useMemo(() => `${WA}?text=${encodeURIComponent("Hi ShikBaris! I want to plan a trip.")}`, []);

  const markSeen = () => {
    try {
      localStorage.setItem(POP_KEY, "1");
    } catch {}
  };

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      if (!localStorage.getItem(POP_KEY)) {
        const t = window.setTimeout(() => setShowWaPopup(true), 900);
        return () => window.clearTimeout(t);
      }
    } catch {
      // ignore
    }
  }, []);

  const openPlan = () => setShowPlan(true);
  const closePlan = () => setShowPlan(false);

  const sendPlan = async () => {
    // Validate all mandatory fields
    if (!fullName.trim()) {
      alert("Please enter Full Name");
      return;
    }
    if (!phNo.trim()) {
      alert("Please enter Phone Number");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      alert("Please enter a valid Email Address");
      return;
    }
    if (!stateCity.trim()) {
      alert("Please enter State or City");
      return;
    }
    if (!travellers.trim()) {
      alert("Please enter Number of Travellers");
      return;
    }
    if (!arrivalCity.trim()) {
      alert("Please enter Arrival City");
      return;
    }
    if (!departureCity.trim()) {
      alert("Please enter Departure City");
      return;
    }

    // Prepare email content
    const subject = `New Trip Planning Request from ${fullName}`;
    const emailBody = 
      `Full Name: ${fullName}\n` +
      `Phone: ${phNo}\n` +
      `Email: ${email}\n` +
      `State/City: ${stateCity}\n` +
      `Number of Travellers: ${travellers}\n` +
      `Arrival City: ${arrivalCity}\n` +
      `Departure City: ${departureCity}\n` +
      `\nTravel Requirements:\n${requirements || "Not provided"}`;

    try {
      // Send via email API (using FormSubmit.io free service)
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("phNo", phNo);
      formData.append("email", email);
      formData.append("stateCity", stateCity);
      formData.append("travellers", travellers);
      formData.append("arrivalCity", arrivalCity);
      formData.append("departureCity", departureCity);
      formData.append("requirements", requirements);
      formData.append("_subject", subject);
      formData.append("_captcha", "false");

      const response = await fetch("https://formsubmit.co/booking@shikbaris.com", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Your trip plan has been sent successfully! We'll contact you shortly.");
        // Reset form
        setFullName("");
        setPhNo("");
        setEmail("");
        setStateCity("");
        setTravellers("");
        setArrivalCity("");
        setDepartureCity("");
        setRequirements("");
        setShowPlan(false);
        markSeen();
      } else {
        throw new Error("Failed to send");
      }
    } catch (error) {
      // Fallback: open mailto link
      const mailtoLink = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      window.open(mailtoLink);
      setShowPlan(false);
    }
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="absolute top-0 left-0 w-full z-40">
        <div className="flex items-center justify-between h-16 md:h-20 px-4 md:px-10 bg-[#ffffff] backdrop-blur">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="ShikBaris" className="h-16 w-auto flex-shrink-0 cursor-pointer" />
          </Link>

          <nav className="hidden md:flex gap-4 md:gap-6 lg:gap-8 xl:gap-10 text-[#000721]  font-medium">
            {nav.map((n) => (
              <span key={n} className="cursor-pointer hover:text-[#0092fb]">
                {n}
              </span>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4 bg-[#ecf1ff] px-3 md:px-4 lg:px-6 py-2 rounded-full text-[#003a64] text-xs md:text-sm lg:text-base font-semibold">
            <a href={TEL} className="flex items-center gap-2 text-[16px]">
              <Phone size={16} className="text-[#0092fb]" />
              +91 9 52 552 5552
            </a>
            <a href={EMAIL} className="flex items-center gap-2 text-[16px]">
              <Mail size={16} className="text-[#0092fb]" />
              {MAIL}
            </a>
          </div>

          <button onClick={() => setOpen(true)} className="md:hidden text-blue" aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>

        {/* Mobile top contact row */}
        <div className="md:hidden 
                flex justify-between items-center 
                bg-[#ecf1ff] backdrop-blur 
                py-2 px-4">

  <a
    href={TEL}
    className="flex items-center gap-1
               text-[13px] font-semibold 
               text-[#003a64]"
  >
    <Phone size={13} className="text-[#0092fb]" />
    +91 9 52 552 5552
  </a>

  <a
    href={EMAIL}
    className="flex items-center gap-1 
               text-[13px] font-semibold 
               text-[#003a64]"
  >
    <Mail size={13} className="text-[#0092fb]" />
    {MAIL}
  </a>

</div>


        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed top-0 right-0 h-full w-[80%] bg-[#000721] text-white p-6 transition-transform duration-300 z-50 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button onClick={() => setOpen(false)} className="absolute top-4 right-4" aria-label="Close menu">
            <X size={24} />
          </button>

          <div className="mt-12">
            {nav.map((n) => (
              <p key={n} className="py-3 text-base cursor-pointer hover:text-[#0092fb]" onClick={() => setOpen(false)}>
                {n}
              </p>
            ))}
          </div>
        </div>

        {open && <div className="fixed inset-0 bg-black/40 md:hidden z-40" onClick={() => setOpen(false)} />}
      </header>

      {/* ================= PLAN YOUR TRIP (VERTICAL TAB - DESKTOP + MOBILE) ================= */}
      <button
        type="button"
        onClick={openPlan}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[998]
                   bg-[#0065ad] text-white font-semibold shadow-lg mx-5
                   px-4 py-3 rounded-2xl
                   hover:brightness-110 active:scale-[0.98] transition"
        aria-label="Plan Your Trip"
        // rotate and keep inside viewport
        style={{ transform: "translateY(-50%) rotate(-90deg)", transformOrigin: "right center" }}
      >
        <span className="flex items-center gap-2">
          <MessageCircle size={18} />
          Plan Your Trip
        </span>
      </button>

      {/* ================= FLOATING CALL (LEFT) ================= */}
      <a
        href={TEL}
        className="fixed bottom-5 left-5 z-[999] hover:scale-105 active:scale-95 transition"
        aria-label="Call"
      >
        <div className="w-12 h-12 bg-[#0092fb] rounded-full flex items-center justify-center shadow-lg">
          <Phone size={22} className="text-white" />
        </div>
      </a>

      {/* ================= WHATSAPP (RIGHT) ================= */}
      <a
        href={waDefault}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-[999] hover:scale-105 active:scale-95 transition"
        aria-label="WhatsApp"
        onClick={markSeen}
      >
        <img src={whatsappLogo} alt="WhatsApp" className="w-12 h-12 drop-shadow-lg" />
      </a>

      {/* ================= SCROLL TO TOP (COLOR CHANGED) ================= */}
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed z-[999] right-5 bottom-[92px] md:bottom-5 md:right-[84px]
                     w-11 h-11 rounded-full shadow-lg
                     bg-[#bcd7ff] hover:bg-[#9dc4ff] active:scale-95 transition
                     flex items-center justify-center"
          aria-label="Scroll to top"
        >
          {/* arrow color changed to theme blue */}
          <ArrowUp size={18} className="text-[#001727]" />
        </button>
      )}

      {/* ================= WHATSAPP WELCOME (FIRST VISIT) -> opens PLAN popup ================= */}
      {showWaPopup && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[1000]" onClick={() => (setShowWaPopup(false), markSeen())} />
          <div className="fixed bottom-20 right-5 z-[1001] w-[320px] max-w-[92vw]">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-black/5">
              <div className="flex items-center justify-between px-4 py-3 bg-[#000721] text-white">
                <div className="flex items-center gap-2">
                  <img src={whatsappLogo} alt="" className="w-6 h-6" />
                  <p className="font-semibold text-sm">Need help planning?</p>
                </div>
                <button
                  type="button"
                  onClick={() => (setShowWaPopup(false), markSeen())}
                  className="text-white/90 hover:text-white transition"
                  aria-label="Close WhatsApp popup"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-4 py-4">
                <p className="text-sm text-[#003a64] leading-relaxed">
                  Share destination + dates — we’ll plan your trip and send pricing on WhatsApp.
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowWaPopup(false);
                      markSeen();
                      openPlan();
                    }}
                    className="flex-1 bg-[#0092fb] text-white text-sm font-semibold rounded-xl px-4 py-2 hover:brightness-110 transition"
                  >
                    Plan Now
                  </button>
                  <button
                    type="button"
                    onClick={() => (setShowWaPopup(false), markSeen())}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-[#003a64] hover:bg-gray-200 transition"
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= PLAN POPUP (SEND TO EMAIL) ================= */}
      {showPlan && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[1100]" onClick={closePlan} />
          <div className="fixed inset-0 z-[1101] flex items-end sm:items-center justify-center p-3">
            <div className="w-full max-w-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-3 bg-[#000721] text-white sticky top-0">
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} />
                  <p className="font-semibold text-sm">Plan Your Trip</p>
                </div>
                <button type="button" onClick={closePlan} className="text-white/90 hover:text-white transition" aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Row 1: Full Name */}
                  <Field label="Full Name *">
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className={inp}
                    />
                  </Field>

                  {/* Row 2: Phone Number */}
                  <Field label="Phone Number *">
                    <input
                      value={phNo}
                      onChange={(e) => setPhNo(e.target.value)}
                      placeholder="+91 XXXXXXXXXX"
                      type="tel"
                      className={inp}
                    />
                  </Field>

                  {/* Row 3: Email Address */}
                  <Field label="Email Address *">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      type="email"
                      className={inp}
                    />
                  </Field>

                  {/* Row 4: State or City */}
                  <Field label="State or City *">
                    <input
                      value={stateCity}
                      onChange={(e) => setStateCity(e.target.value)}
                      placeholder="e.g. Kerala, Tamil Nadu"
                      className={inp}
                    />
                  </Field>

                  {/* Row 5: No. of Travellers */}
                  <Field label="No. of Travellers *">
                    <input
                      value={travellers}
                      onChange={(e) => setTravellers(e.target.value)}
                      placeholder="e.g. 4"
                      type="number"
                      className={inp}
                    />
                  </Field>

                  {/* Row 6: Arrival City */}
                  <Field label="Arrival City *">
                    <input
                      value={arrivalCity}
                      onChange={(e) => setArrivalCity(e.target.value)}
                      placeholder="e.g. Kochi, Chennai"
                      className={inp}
                    />
                  </Field>

                  {/* Row 7: Departure City */}
                  <Field label="Departure City *">
                    <input
                      value={departureCity}
                      onChange={(e) => setDepartureCity(e.target.value)}
                      placeholder="e.g. Kochi, Chennai"
                      className={inp}
                    />
                  </Field>
                </div>

                {/* Optional textarea */}
                <Field label="Describe your travel requirements" className="mt-3">
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Tell us about your travel preferences, budget, hotels, places to visit, etc."
                    className={`${inp} min-h-[100px] py-3`}
                  />
                </Field>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={sendPlan}
                    className="flex-1 h-11 rounded-xl bg-[#0092fb] text-white font-semibold hover:brightness-110 transition"
                  >
                    Send Request
                  </button>
                  <button
                    type="button"
                    onClick={closePlan}
                    className="h-11 px-4 rounded-xl bg-gray-100 text-[#003a64] font-semibold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>

                <p className="mt-3 text-[11px] text-gray-500">
                  * All fields marked with asterisk are mandatory. We'll contact you at the provided email and phone number.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* ---------- tiny helpers (less repeated code) ---------- */
const inp =
  "mt-1 w-full h-11 px-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0092fb]/40";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold text-[#003a64]">{label}</label>
      {children}
    </div>
  );
}
