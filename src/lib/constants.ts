export const PRODUCT_DATA = [
  { 
    id: 101, 
    key: "cap", 
    price: 45880, 
    cat: "accessories", 
    img: "/images/products/cap.png",
    gallery: [
      "/images/products/cap.png",
      "https://images.unsplash.com/photo-1588850567047-1849a4444581?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1596755094514-f87034a7a988?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&q=80&w=800"
    ],
    specs: {
      material: "Premium Eco-Cotton",
      dimensions: "Ajustable (54-62cm)",
      weight: "120g",
      finish: "Bordado de alta densidad",
      care: "Lavar a mano únicamente",
      origin: "Colombia"
    }
  },
  { 
    id: 102, 
    key: "hoodie", 
    price: 109225, 
    cat: "clothing", 
    img: "/images/products/hoodie.png",
    gallery: [
      "/images/products/hoodie.png",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512446733611-9099a758e894?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&q=80&w=800"
    ],
    specs: {
      material: "Algodón Orgánico & Poliéster Reciclado",
      dimensions: "XS, S, M, L, XL",
      weight: "480g",
      finish: "Interior cepillado ultra suave",
      care: "Lavar a máquina (agua fría)",
      origin: "Colombia"
    }
  },
  { 
    id: 103, 
    key: "shirt", 
    price: 52770, 
    cat: "clothing", 
    img: "/images/products/shirt.png",
    gallery: [
      "/images/products/shirt.png",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800"
    ],
    specs: {
      material: "100% Algodón Pima",
      dimensions: "Fit Clásico - Unisex",
      weight: "180g",
      finish: "Tacto sedoso pre-encogido",
      care: "Secado a la sombra",
      origin: "Perú / Colombia"
    }
  },
  { 
    id: 104, 
    key: "bracelet", 
    price: 18550, 
    cat: "accessories", 
    img: "/images/products/bracelet.png",
    gallery: [
      "/images/products/bracelet.png",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1508113354073-63e52475ecfe?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=800"
    ],
    specs: {
      material: "Hilo encerado & Piedras naturales",
      dimensions: "Ajustable (Universal)",
      weight: "15g",
      finish: "Tejido a mano artesanal",
      care: "Evitar contacto con químicos",
      origin: "Artesanos de Boyacá"
    }
  },
  { 
    id: 105, 
    key: "ebook_anxiety", 
    price: 27990, 
    cat: "ebooks", 
    img: "/images/products/ebook_ansiedad.png",
    gallery: [
      "/images/products/ebook_ansiedad.png",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800"
    ],
    specs: {
      material: "Formato Digital PDF / ePub",
      dimensions: "120 páginas",
      weight: "8.5 MB",
      finish: "Interactivo con ejercicios",
      care: "Acceso de por vida",
      origin: "Equipo Soulmar"
    }
  },
  { id: 106, key: "ebook_depression", price: 27990, cat: "ebooks", img: "/images/products/ebook_depresion.png", gallery: ["/images/products/ebook_depresion.png", "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=800"], specs: { material: "PDF Digital", dimensions: "115 páginas", weight: "7.2 MB", finish: "Guía de acompañamiento", care: "Digital", origin: "Soulmar" } },
  { id: 107, key: "ebook_mindset", price: 32990, cat: "ebooks", img: "/images/products/ebook_mindset.png", gallery: ["/images/products/ebook_mindset.png", "https://images.unsplash.com/photo-1516589174184-c6858b16d446?auto=format&fit=crop&q=80&w=800"], specs: { material: "PDF Digital", dimensions: "150 páginas", weight: "10.4 MB", finish: "Mentalidad de crecimiento", care: "Digital", origin: "Soulmar" } },
  { id: 108, key: "notebooks", price: 23750, cat: "souvenirs", img: "/images/products/notebooks.png", gallery: ["/images/products/notebooks.png", "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800"], specs: { material: "Papel Ecológico 90g", dimensions: "A5 (15x21cm)", weight: "300g", finish: "Pasta dura - Soft Touch", care: "Mantener en lugar seco", origin: "Colombia" } },
];

export const COURSE_DATA = [
  { id: "course1", category: "anxiety", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800", rating: 4.8, duration: "4h 20m", price: 85000, isNew: true, instructor: "Dra. Mariana Caicedo", episodes: 7 },
  { id: "course2", category: "anxiety", image: "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=800", rating: 4.9, duration: "3h 45m", price: 95000, instructor: "Dr. Moshé Musini", episodes: 7 },
  { id: "course3", category: "anxiety", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800", rating: 4.7, duration: "5h 10m", price: 75000, instructor: "Dra. Libertad Mejía", episodes: 7 },
  { id: "course4", category: "mindfulness", image: "https://images.unsplash.com/photo-1516589174184-c6858b16d446?auto=format&fit=crop&q=80&w=800", rating: 5.0, duration: "2h 30m", price: 65000, instructor: "Dra. Mariana Caicedo", episodes: 7 },
  { id: "course5", category: "mindfulness", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800", rating: 4.6, duration: "3h 15m", price: 55000, instructor: "Dra. Mariana Caicedo", episodes: 7 },
  { id: "course6", category: "mindfulness", image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800", rating: 4.9, duration: "4h 00m", price: 89000, instructor: "Dr. Moshé Musini", episodes: 7 },
  { id: "course7", category: "growth", image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=800", rating: 4.8, duration: "6h 20m", price: 110000, instructor: "Dra. Libertad Mejía", episodes: 7 },
  { id: "course8", category: "growth", image: "https://images.unsplash.com/photo-1516589174184-c6858b16d446?auto=format&fit=crop&q=80&w=800", rating: 4.7, duration: "3h 50m", price: 78000, instructor: "Dra. Mariana Caicedo", episodes: 7 },
  { id: "course9", category: "yoga", image: "https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&q=80&w=800", rating: 5.0, duration: "5h 30m", price: 125000, instructor: "Dra. Mariana Caicedo", episodes: 7 },
  { id: "course10", category: "yoga", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800", rating: 4.9, duration: "4h 15m", price: 92000, instructor: "Dr. Moshé Musini", episodes: 7 },
  { id: "course11", category: "anxiety", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800", rating: 4.8, duration: "3h 10m", price: 68000, instructor: "Dra. Libertad Mejía", episodes: 7 },
  { id: "course12", category: "growth", image: "https://images.unsplash.com/photo-1454165833221-d7d6b885076b?auto=format&fit=crop&q=80&w=800", rating: 4.7, duration: "2h 50m", price: 59000, instructor: "Dra. Mariana Caicedo", episodes: 7 },
  { id: "course13", category: "relationships", image: "https://images.unsplash.com/photo-1470432344838-423bb606349c?auto=format&fit=crop&q=80&w=800", rating: 4.9, duration: "4h 45m", price: 95000, instructor: "Dra. Mariana Caicedo", episodes: 7 },
  { id: "course14", category: "psychology", image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800", rating: 5.0, duration: "5h 20m", price: 130000, instructor: "Dr. Moshé Musini", episodes: 7 },
  { id: "course15", category: "growth", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800", rating: 4.8, duration: "3h 30m", price: 72000, instructor: "Dra. Libertad Mejía", episodes: 7 },
  { id: "course16", category: "relationships", image: "https://images.unsplash.com/photo-1492176273113-2d51f47b23b0?auto=format&fit=crop&q=80&w=800", rating: 4.7, duration: "4h 10m", price: 88000, instructor: "Dra. Mariana Caicedo", episodes: 7 },
  { id: "course17", category: "psychology", image: "https://images.unsplash.com/photo-1515023115689-589c33041d3c?auto=format&fit=crop&q=80&w=800", rating: 4.9, duration: "6h 00m", price: 115000, instructor: "Dra. Mariana Caicedo", episodes: 7 },
  { id: "course18", category: "growth", image: "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&q=80&w=800", rating: 4.6, duration: "3h 20m", price: 62000, instructor: "Dr. Moshé Musini", episodes: 7 },
  { id: "course19", category: "growth", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", rating: 4.8, duration: "4h 50m", price: 105000, instructor: "Dra. Libertad Mejía", episodes: 7 },
  { id: "course20", category: "growth", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800", rating: 5.0, duration: "5h 45m", price: 140000, instructor: "Dra. Mariana Caicedo", episodes: 7 }
];

export const WHATSAPP_PHONE = "+57 302 459 4428";
export const WHATSAPP_ID = "573024594428";
export const WHATSAPP_DEFAULT_MESSAGE = "Hola 🌿✨ estoy dando este paso porque quiero empezar a sentirme mejor conmigo 💛 Me encantaría que me orientaran un poco sobre cómo Soulmar puede acompañarme en este proceso 💙";
export const WHATSAPP_LINK = `https://api.whatsapp.com/send?phone=${WHATSAPP_ID}&text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;

export const THERAPIST_IDS = {
  MARIANA: "a1b2c3d4-1111-4000-8000-000000000001",
  MOSHE: "a1b2c3d4-2222-4000-8000-000000000002",
  LIBERTAD: "a1b2c3d4-3333-4000-8000-000000000003"
};

export const ALL_THERAPIST_IDS = Object.values(THERAPIST_IDS);
