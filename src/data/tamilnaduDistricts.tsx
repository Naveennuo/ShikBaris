// src/data/tamilnaduDistricts.ts
export type Sight = { name: string; img: string };
export type District = { title: string; banner: string; sights: Sight[] };

const b = (file: string) =>
  new URL(`../assets/tamilnadu/district/${file}`, import.meta.url).href;

const p = (folder: string, file: string) =>
  new URL(`../assets/tamilnadu/${folder}/${file}`, import.meta.url).href;

export const DISTRICTS: Record<string, District> = {
  nilgiris: {
    title: "The Nilgiris",
    banner: b("nilgiris.jpg"),
    sights: [
      { name: "Mudumalai Tiger reserv Forest", img: p("nilgiris", "mudumalai.jpg") },
      { name: "Pykara waterfall", img: p("nilgiris", "pykara-waterfall.jpg") },
      { name: "Nilgiris tea Gardens", img: p("nilgiris", "tea-gardens.png") },
      { name: "Botanical garden", img: p("nilgiris", "botanical-garden.jpg") },
      { name: "Doddabetta peak", img: p("nilgiris", "doddabetta.jpg") },
      { name: "Boat House", img: p("nilgiris", "boat-house.jpg") },
      { name: "Avalanche lake", img: p("nilgiris", "avalanche-lake.jpg") },
      { name: "Rose garden", img: p("nilgiris", "rose-garden.jpg") },
      { name: "Kodanad view point", img: p("nilgiris", "kodanad-view.jpg") },
      { name: "Nilgiris Toy train", img: p("nilgiris", "toy-train.jpeg") },
      { name: "Lamb's Rock", img: p("nilgiris", "lambs-rock.jpg") },
      { name: "Pykara Lake", img: p("nilgiris", "pykara-lake.jpg") },
      { name: "Upper Bavani reservoir", img: p("nilgiris", "upper-bhavani.jpg") },
      { name: "Karnataka Horticulture garden", img: p("nilgiris", "horticulture-garden.jpg") },
      { name: "Coonoor", img: p("nilgiris", "coonoor.jpg") },
      { name: "Kotagiri", img: p("nilgiris", "kotagiri.jpg") },
      { name: "Thunder world", img: p("nilgiris", "thunder-world.png") },
      { name: "Sim's Park", img: p("nilgiris", "sims-park.jpg") },
      { name: "Dolphin's Nose", img: p("nilgiris", "dolphins-nose.jpg") },
      { name: "Masinagudi Jeep Safari", img: p("nilgiris", "masinagudi-jeep-safari.jpg") },
      { name: "Theppakadu Elephant Camp", img: p("nilgiris", "theppakadu.webp") },
      { name: "Bandipur Jeep Safari", img: p("nilgiris", "bandipur-jeep-safari.jpg") },
      { name: "Kattery Park", img: p("nilgiris", "kattery-park.jpg") },
    ],
  },

  kanchipuram: {
    title: "Kanchipuram",
    banner: b("kanchipuram.jpg"),
    sights: [
      { name: "Sri Kanchi Kamakshi Amman Temple", img: p("kanchipuram", "kamakshi-temple.jpg") },
      { name: "Ekambaranathar Temple", img: p("kanchipuram", "ekambaranathar-temple.jpg") },
      { name: "Shri Chitragupta Swamy Temple", img: p("kanchipuram", "chitragupta-temple.jpg") },
      { name: "Kailasanatha Temple", img: p("kanchipuram", "kailasanatha-temple.jpg") },
      { name: "Sri Ulagalanda Perumal Devasthanam", img: p("kanchipuram", "ulagalanda-perumal.webp") },
      { name: "Sri Varadharaja Perumal Temple", img: p("kanchipuram", "varadharaja-perumal.jpg") },
      { name: "Vedanthangal Birds Sanctuary", img: p("kanchipuram", "vedanthangal.jpg") },
    ],
  },

  coimbatore: {
    title: "Coimbatore",
    banner: b("coimbatore.jpg"),
    sights: [
      { name: "Gedee Car Museum", img: p("coimbatore", "gedee-museum.jpg") },
      { name: "Maruthamalai Temple", img: p("coimbatore", "maruthamalai.jpg") },
      { name: "Adiyogi", img: p("coimbatore", "adiyogi.jpg") },
      { name: "Dhyana Lingam", img: p("coimbatore", "dhyana-lingam.jpg") },
      { name: "Monkey Falls", img: p("coimbatore", "monkey-falls.jpg") },
      { name: "Siruvani Waterfalls", img: p("coimbatore", "siruvani.png") },
      { name: "Black Thunder Theme Park", img: p("coimbatore", "black-thunder.jpg") },
      { name: "Fun Republic Mall", img: p("coimbatore", "fun-republic.png") },
      { name: "Kovai Kutralam", img: p("coimbatore", "kovai-kutralam.jpg") },
      { name: "Velliangiri Hills", img: p("coimbatore", "velliangiri.jpg") },
      { name: "Palakkad Fort", img: p("coimbatore", "palakkad-fort.jpg") },
      { name: "Kodiveri Dam", img: p("coimbatore", "kodiveri-dam.jpg") },
    ],
  },

  chennai: {
    title: "Chennai",
    banner: b("chennai.jpg"),
    sights: [
      { name: "Kapaleeshwarar Temple", img: p("chennai", "kapaleeshwarar.webp") },
      { name: "Santhome Cathedral Basilica", img: p("chennai", "santhome.webp") },
      { name: "Sri Parthasarathy Temple", img: p("chennai", "parthasarathy.jpg") },
      { name: "Vadapalani Murugan Temple", img: p("chennai", "vadapalani.jpg") },
      { name: "Government Museum", img: p("chennai", "government-museum.jpg") },
      { name: "Fort St. George Museum", img: p("chennai", "fort-st-george.jpg") },
      { name: "Marina Beach", img: p("chennai", "marina-beach.jpg") },
      { name: "Semmozhi Park", img: p("chennai", "semmozhi-park.jpg") },
      { name: "Express Avenue Mall", img: p("chennai", "express-avenue.jpg") },
      { name: "T. Nagar Shopping", img: p("chennai", "t-nagar.jpg") },
      { name: "MGM Dizzee World", img: p("chennai", "mgm-dizzee-world.jpg") },
    ],
  },

  mahabalipuram: {
    title: "Mahabalipuram",
    banner: b("mahabalipuram.jpg"),
    sights: [
      { name: "Shore Temple", img: p("mahabalipuram", "shore-temple.jpg") },
      { name: "Pancha Rathas (Five Rathas)", img: p("mahabalipuram", "five-rathas.jpeg") },
      { name: "Krishna's Butter Ball", img: p("mahabalipuram", "krishnas-butter-ball.jpg") },
      { name: "Arjuna's Penance", img: p("mahabalipuram", "arjunas-penance.jpg") },
      { name: "Sea Shell Museum", img: p("mahabalipuram", "sea-shell-museum.png") },
      { name: "Mahabalipuram Beach", img: p("mahabalipuram", "mahabalipuram-beach.jpg") },
      { name: "Tiger Cave", img: p("mahabalipuram", "tiger-cave.jpg") },
      { name: "Varaha Cave Temple", img: p("mahabalipuram", "varaha-cave.jpg") },
      { name: "Mahishasura Mardini Cave", img: p("mahabalipuram", "mahishasura-mardini-cave.jpg") },
      { name: "Madras Crocodile Bank Trust", img: p("mahabalipuram", "crocodile-bank.png") },
      { name: "Krishna Mandapam", img: p("mahabalipuram", "krishna-mandapam.webp") },
      { name: "Mahabalipuram Lighthouse", img: p("mahabalipuram", "light-house.jpg") },
    ],
  },

  thanjavur: {
    title: "Thanjavur",
    banner: b("thanjavur.jpg"),
    sights: [
      { name: "Sri Brihadeeswara Temple", img: p("thanjavur", "brihadeeswara-temple.png") },
      { name: "Thanjavur Maratha Palace", img: p("thanjavur", "maratha-palace.webp") },
      { name: "Saraswathi Mahal Library", img: p("thanjavur", "saraswathi-mahal-library.jpg") },
      { name: "Punnainallur Mariamman Temple", img: p("thanjavur", "punnainallur-mariamman.jpeg") },
      { name: "Rajaraja Chola Manimandapam", img: p("thanjavur", "rajaraja-chola-manimandapam.jpg") },
      { name: "Thanjavur Art Gallery", img: p("thanjavur", "art-gallery.webp") },
      { name: "Poondi Madha Church", img: p("thanjavur", "poondi-madha-church.jpg") },
    ],
  },

  kodaikanal: {
    title: "Kodaikanal",
    banner: b("kodaikanal.jpg"),
    sights: [
      { name: "Dum Dum Parai", img: p("kodaikanal", "dum-dum-parai.jpg") },
      { name: "Manjalaru Dam View Point", img: p("kodaikanal", "manjalaru-dam-view-point.jpg") },
      { name: "Silver Cascade Falls", img: p("kodaikanal", "silver-cascade-falls.jpg") },
      { name: "Star Lake", img: p("kodaikanal", "star-lake.webp") },
      { name: "Horror House", img: p("kodaikanal", "horror-house.webp") },
      { name: "Cycling", img: p("kodaikanal", "cycling.jpeg") },
      { name: "Horse Riding", img: p("kodaikanal", "horse-riding.jpg") },
      { name: "Boat House", img: p("kodaikanal", "boat-house.jpg") },
      { name: "Bryant Park", img: p("kodaikanal", "bryant-park.jpg") },
      { name: "Coaker’s Walk", img: p("kodaikanal", "coakers-walk.jpg") },
      { name: "Upper Lake View Point", img: p("kodaikanal", "upper-lake-view-point.jpg") },
      { name: "Liril Falls", img: p("kodaikanal", "liril-falls.jpg") },
      { name: "Green Valley View Point", img: p("kodaikanal", "green-valley-view-point.jpg") },
      { name: "Golf Club", img: p("kodaikanal", "golf-club.jpg") },
      { name: "Pillar Rock", img: p("kodaikanal", "pillar-rock.jpg") },
      { name: "Guna Cave", img: p("kodaikanal", "guna-cave.jpg") },
      { name: "Pine Forest", img: p("kodaikanal", "pine-forest.jpg") },
      { name: "Moir Point", img: p("kodaikanal", "moir-point.jpg") },
      { name: "Dolphin Nose", img: p("kodaikanal", "dolphin-nose.jpg") },
      { name: "Rose Garden", img: p("kodaikanal", "rose-garden.jpg") },
      { name: "Poombarai Village", img: p("kodaikanal", "poombarai-village.jpg") },
      { name: "Kulanthai Velappar Temple", img: p("kodaikanal", "kulanthai-velappar-temple.jpg") },
      { name: "Mannavanoor", img: p("kodaikanal", "mannavanoor.jpeg") },
      { name: "Chettiar Park", img: p("kodaikanal", "chettiar-park.jpg") },
      { name: "Kurinji Andavar Temple", img: p("kodaikanal", "kurinji-andavar-temple.png") },
    ],
  },

  trichy: {
    title: "Tiruchirappalli (Trichy)",
    banner: b("trichy.jpg"),
    sights: [
      { name: "Srirangam Temple", img: p("trichy", "srirangam-temple.jpg") },
      { name: "Jambukeswarar Temple", img: p("trichy", "jambukeswarar-temple.jpg") },
      { name: "Rockfort Temple", img: p("trichy", "rock-fort-temple.webp") },
      { name: "Samayapuram Temple", img: p("trichy", "samayapuram-temple.jpg") },
      { name: "Kallanai Dam", img: p("trichy", "kallanai-dam.jpg") },
      { name: "Viralimalai Murugan Temple", img: p("trichy", "viralimalai-murugan-temple.webp") },
      { name: "Aagaya Gangai Waterfalls", img: p("trichy", "aagaya-gangai-waterfalls.jpg") },
    ],
  },

  thiruvannamalai: {
    title: "Thiruvannamalai",
    banner: b("thiruvannamalai.jpg"),
    sights: [
      { name: "Arunachaleswarar Temple", img: p("thiruvannamalai", "arunachaleswarar-temple.jpg") },
      { name: "Gingee Fort", img: p("thiruvannamalai", "gingee-fort.jpg") },
      { name: "Parvathamalai Hills", img: p("thiruvannamalai", "parvathamalai-hills.jpg") },
      { name: "Girivalam Road", img: p("thiruvannamalai", "girivalam-road.webp") },
      { name: "Sathanur Dam", img: p("thiruvannamalai", "sathanur-dam.jpg") },
      { name: "Jawadhu Hills", img: p("thiruvannamalai", "jawadhu-hills.jpg") },
    ],
  },

  courtallam: {
    title: "Courtallam",
    banner: b("courtallam.jpg"),
    sights: [
      { name: "Main Water Falls", img: p("courtallam", "main-water-falls.jpg") },
      { name: "Five Falls", img: p("courtallam", "five-falls.jpg") },
      { name: "Peraruvi Park", img: p("courtallam", "peraruvi-park.jpg") },
      { name: "Old Falls", img: p("courtallam", "old-falls.jpg") },
      { name: "Chitraruvi", img: p("courtallam", "chitraruvi.jpg") },
      { name: "Tiger Falls", img: p("courtallam", "tiger-falls.jpg") },
      { name: "Palaruvi", img: p("courtallam", "palaruvi.webp") },
      { name: "Gundaru Dam", img: p("courtallam", "gundaru-dam.jpg") },
      { name: "Shenbaga Devi Falls", img: p("courtallam", "shenbaga-devi-falls.jpg") },
      { name: "Rosemala View Point", img: p("courtallam", "rosemala-view-point.webp") },
    ],
  },

  theniandcumbum: {
    title: "Theni & Cumbum",
    banner: b("theniandcumbum.jpg"),
    sights: [
      { name: "Vaigai Dam", img: p("theniandcumbum", "vaigai-dam.jpg") },
      { name: "Kumbakarai Falls", img: p("theniandcumbum", "kumbakarai-falls.jpg") },
      { name: "Suruli Falls", img: p("theniandcumbum", "suruli-falls.jpg") },
      { name: "Veerapandi Temple", img: p("theniandcumbum", "veerapandi-temple.webp") },
      { name: "Saneeswaran Temple", img: p("theniandcumbum", "saneeswaran-temple.jpg") },
      { name: "Dharmashastha Temple", img: p("theniandcumbum", "dharmashastha-temple.webp") },
      { name: "Kurangani Falls", img: p("theniandcumbum", "kurangani-falls.webp") },
      { name: "Shothupara Dam", img: p("theniandcumbum", "shothupara-dam.jpg") },
    ],
  },
  
  kanyakumari: {
  title: "Kanyakumari",
  banner: b("kanyakumari.jpg"),
  sights: [
    { name: "Vivekananda Rock Memorial", img: p("kanyakumari", "vivekananda-rock-memorial.jpg") },
    { name: "Thiruvalluvar Statue", img: p("kanyakumari", "thiruvalluvar-statue.jpg") },
    { name: "Bhagavathi Amman Temple", img: p("kanyakumari", "bhagavathi-amman-temple.jpg") },
    { name: "Sunrise Point", img: p("kanyakumari", "sunrise-point.jpg") },
    { name: "Sunset Point", img: p("kanyakumari", "sunset-point.jpg") },
    { name: "Suchindram Temple", img: p("kanyakumari", "suchindram-temple.jpg") },
    { name: "Our Lady of Ransom Church", img: p("kanyakumari", "our-lady-of-ransom-church.jpg") },
    { name: "Gandhi Mandapam", img: p("kanyakumari", "gandhi-mandapam.jpg") },
    { name: "Kanyakumari Beach", img: p("kanyakumari", "kanyakumari-beach.jpg") },
    { name: "Vattakottai Fort", img: p("kanyakumari", "vattakottai-fort.jpg") },
    { name: "Padmanabhapuram Palace", img: p("kanyakumari", "padmanabhapuram-palace.jpg") },
    { name: "Tirupati Balaji Temple", img: p("kanyakumari", "tirupati-balaji-temple.webp") },
    { name: "Triveni Sangamam", img: p("kanyakumari", "triveni-sangamam.webp") },
    { name: "Wax Museum", img: p("kanyakumari", "wax-museum.jpg") },
    { name: "Musical Fountains", img: p("kanyakumari", "musical-fountains.jpg") },
  ],
},

  kollimalaihills: {
    title: "Kolli Malai Hills",
    banner: b("kollimalaihills.jpeg"),
    sights: [
      { name: "Aagaya Gangai Falls", img: p("kollimalaihills", "aagaya-gangai-falls.jpg") },
      { name: "Kolli Malai Forest", img: p("kollimalaihills", "kolli-malai-forest.jpg") },
      { name: "Seeku Parai View Point", img: p("kollimalaihills", "seeku-parai-view-point.jpg") },
      { name: "Namma Aruvi Falls", img: p("kollimalaihills", "namma-aruvi-falls.jpg") },
      { name: "Kolli Hills Bend View", img: p("kollimalaihills", "kolli-hills-bend-view.jpg") },
      { name: "Maasila Falls", img: p("kollimalaihills", "maasila-falls.jpg") },
      { name: "Pulian Cholai View Point", img: p("kollimalaihills", "pulian-cholai-view-point.jpeg") },
      { name: "Kolli Malai Trekking", img: p("kollimalaihills", "kolli-malai-trekking.JPG") },
    ],
  },



};

