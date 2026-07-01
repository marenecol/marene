/**
 * Catálogo principal de MARENE.
 *
 * Administra tu tienda desde este único archivo.
 * Para agregar un producto nuevo, solo edita `PRODUCTS` y copia las imágenes a `assets/images`.
 */

// 1. CONFIGURACIÓN DE CATEGORÍAS (Para el menú de filtros)
const CATEGORIES = [
    { id: 'collares', label: 'Collares', enabled: true },
    { id: 'cinturones', label: 'Cinturones en Mostacilla', enabled: true }
];

// 2. BASE DE DATOS DE PRODUCTOS REALES DE LA TIENDA
const PRODUCTS = [
    // --- SECCIÓN: COLLARES ---
    {
        id: 'collar-aura',
        name: 'Collar Aura',
        category: 'collares', // <--- Importante: Debe coincidir con el ID de arriba
        categoryLabel: 'Collares',
        price: 119000,
        rating: 4.9,
        reviewsCount: 18,
        description: 'Collar minimalista con baño de oro para llevar tu look diario con un brillo sutil y elegante.',
        material: 'Latón con baño de oro de 24 quilates',
        dimensions: 'Cadena 45 cm + extensor 5 cm',
        care: 'Evitar el contacto directo con agua, perfumes y cremas.',
        features: ['Hipoalergénico', 'Cierre seguro', 'Diseño versátil'],
        mainImage: 'assets/images/collar-aura-1.png', // <--- Asegúrate que esta foto exista
        images: ['assets/images/collar-aura-1.png', 'assets/images/collar-aura-2.png'],
        colors: [
            { hex: '#c8a97b', name: 'Oro' },
            { hex: '#d9d2c7', name: 'Plata' }
        ],
        featured: true,
        new: true
    },
    {
        id: 'collar-luna',
        name: 'Collar Luna',
        category: 'collares',
        categoryLabel: 'Collares',
        price: 98000,
        rating: 4.8,
        reviewsCount: 12,
        description: 'Cadena delicada con un colgante en forma de luna, perfecta para estilizar capas.',
        material: 'Plata de ley 925 bañado en oro',
        dimensions: 'Cadena 42 cm + extensor 4 cm',
        colors: [
            { hex: '#e9d8be', name: 'Oro' }
        ],
        mainImage: 'assets/images/collar-luna-1.png',
        images: ['assets/images/collar-luna-1.png'],
        featured: false,
        new: false
    },

    // --- NUEVA SECCIÓN: CINTURONES EN MOSTACILLA ---
    {
        id: 'cinturon-etnico-1',
        name: 'Cinturón Mostacilla Étnico',
        category: 'cinturones', // <--- Vincula con el filtro de "Cinturones"
        categoryLabel: 'Cinturones',
        price: 185000,
        rating: 5.0,
        reviewsCount: 4,
        description: 'Cinturón artesanal tupido, tejido a mano con mostacilla premium calibrada. Patrón geométrico sutil.',
        material: 'Mostacilla checa calibrada y nylon de alta resistencia',
        dimensions: '85 cm de largo x 4 cm de ancho',
        care: 'Almacenar extendido, evitar humedad extrema.',
        mainImage: 'https://images.unsplash.com/photo-1624206112918-f14bf801314d?q=80&w=600&auto=format&fit=crop', // <--- Foto temporal de internet
        images: ['https://images.unsplash.com/photo-1624206112918-f14bf801314d?q=80&w=600&auto=format&fit=crop'],
        colors: [
            { hex: '#f4f1ea', name: 'Arena Étnica' },
            { hex: '#111111', name: 'Negro Aura' }
        ],
        featured: true,
        new: true
    },
    {
        id: 'cinturon-minimal-2',
        name: 'Cinturón Minimal Oro',
        category: 'cinturones',
        categoryLabel: 'Cinturones',
        price: 198000,
        rating: 4.9,
        reviewsCount: 7,
        description: 'Elegancia pura. Cinturón de mostacilla en tono dorado mate metalizado. Cierre ajustable delicado.',
        material: 'Mostacilla checa metalizada y herrajes bañados en oro',
        dimensions: '90 cm de largo x 3.5 cm de ancho',
        mainImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop', // <--- Foto temporal de internet
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop'],
        colors: [
            { hex: '#c8a97b', name: 'Dorado Aura' }
        ],
        featured: true,
        new: false
    }
];

// 3. CONFIGURACIÓN DEL SITIO Y MENSAJES DE WHATSAPP
const CONFIG = {
    siteName: 'MARENE',
    whatsappNumber: '573001234567', // Tu número real aquí
    whatsappIntro: 'Hola MARENE, quiero recibir atención personalizada.',
    heroDescription: 'Elegancia sutil y diseño minimalista para acompañarte.'
};

// Formateador de moneda en pesos colombianos COP (Global)
window.formatCOP = function(value) {
    return '$' + value.toLocaleString('es-CO');
};

// Hacer disponible globalmente
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PRODUCTS, CATEGORIES, CONFIG };
} else {
    window.PRODUCTS = PRODUCTS;
    window.CATEGORIES = CATEGORIES;
    window.CONFIG = CONFIG;
}
