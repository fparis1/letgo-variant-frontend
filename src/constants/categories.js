const categories = {
  Elektronika: {
    hr: "Elektronika",
    en: "Electronics",
    subcategories: [
      { hr: "Mobilni telefoni i tableti", en: "Mobile phones and tablets" },
      { hr: "Laptopi i računala", en: "Laptops and computers" },
      { hr: "TV i audio uređaji", en: "TV and audio devices" },
      { hr: "Fotoaparati i kamere", en: "Cameras and camcorders" },
      { hr: "Igre i konzole", en: "Games and consoles" },
      { hr: "Ostala elektronika", en: "Other electronics" }
    ]
  },
  Vozila: {
    hr: "Vozila",
    en: "Vehicles",
    subcategories: [
      { hr: "Automobili", en: "Cars" },
      { hr: "Motocikli", en: "Motorcycles" },
      { hr: "Bicikli", en: "Bicycles" },
      { hr: "Kamioni i kombiji", en: "Trucks and vans" },
      { hr: "Brodovi i plovila", en: "Boats and vessels" },
      { hr: "Prikolice i kamp-prikolice", en: "Trailers and campers" }
    ]
  },
  Nekretnine: {
    hr: "Nekretnine",
    en: "Real Estate",
    subcategories: [
      { hr: "Stanovi", en: "Apartments" },
      { hr: "Kuće", en: "Houses" },
      { hr: "Poslovni prostori", en: "Commercial spaces" },
      { hr: "Zemljišta", en: "Land" },
      { hr: "Vikendice", en: "Cottages" },
      { hr: "Ostale nekretnine", en: "Other real estate" }
    ]
  },
  Namještaj: {
    hr: "Namještaj",
    en: "Furniture",
    subcategories: [
      { hr: "Dnevni boravak", en: "Living room" },
      { hr: "Spavaća soba", en: "Bedroom" },
      { hr: "Kuhinja", en: "Kitchen" },
      { hr: "Kupaonica", en: "Bathroom" },
      { hr: "Vrt i terasa", en: "Garden and terrace" },
      { hr: "Ostali namještaj", en: "Other furniture" }
    ]
  },
  Odjeća: {
    hr: "Odjeća",
    en: "Clothing",
    subcategories: [
      { hr: "Muška odjeća", en: "Men's clothing" },
      { hr: "Ženska odjeća", en: "Women's clothing" },
      { hr: "Dječja odjeća", en: "Children's clothing" },
      { hr: "Obuća", en: "Footwear" },
      { hr: "Modni dodaci", en: "Fashion accessories" },
      { hr: "Ostala odjeća", en: "Other clothing" }
    ]
  },
  Sport: {
    hr: "Sport",
    en: "Sports",
    subcategories: [
      { hr: "Sportska oprema", en: "Sports equipment" },
      { hr: "Bicikli", en: "Bicycles" },
      { hr: "Fitness oprema", en: "Fitness equipment" },
      { hr: "Kampiranje", en: "Camping" },
      { hr: "Lovačka oprema", en: "Hunting equipment" },
      { hr: "Ostali sportovi", en: "Other sports" }
    ]
  },
  Ostalo: {
    hr: "Ostalo",
    en: "Other",
    subcategories: [
      { hr: "Knjige", en: "Books" },
      { hr: "Igračke", en: "Toys" },
      { hr: "Glazbeni instrumenti", en: "Musical instruments" },
      { hr: "Umjetnine", en: "Art" },
      { hr: "Kolekcionarstvo", en: "Collectibles" },
      { hr: "Ostalo", en: "Other" }
    ]
  }
};

export default categories;