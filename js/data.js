/**
 * Catálogo principal de MARENE.
 *
 * Administra tu tienda desde este único archivo.
 * Para agregar un producto nuevo, solo edita `PRODUCTS` y copia las imágenes a `assets/images`.
 */

const CATEGORIES = [
    { id: 'collares', label: 'Collares', enabled: true }
];

// Productos reales de la tienda.
// Mapeamos los colores con su nombre en texto plano para el mensaje de WhatsApp.
const PRODUCTS = [
    {
        id: 'collar-aura',
        name: 'Collar Aura',
        category: 'collares',
        categoryLabel: 'Collares',
        price: 119000,
        rating: 4.9,
        reviewsCount: 18,
        description: 'Collar minimalista con baño de oro para llevar tu look diario con un brillo sutil y elegante.',
        material: 'Latón con baño de oro de 24 quilates',
        dimensions: 'Cadena 45 cm + extensor 5 cm',
        care: 'Evitar el contacto directo con agua, perfumes y cremas para prolongar su acabado.',
        features: ['Hipoalergénico', 'Cierre seguro', 'Diseño versátil'],
        mainImage: 'assets/images/collar-aura-1.png',
        hoverImage: 'assets/images/collar-aura-2.png',
        images: ['assets/images/collar-aura-1.png', 'assets/images/collar-aura-2.png', 'assets/images/collar-aura-3.png'],
        // Colores configurados con código HEX y nombre para WhatsApp (Boceto image_11.png)
        colors: [
            { hex: '#c8a97b', name: 'Oro' },
            { hex: '#d9d2c7', name: 'Plata' },
            { hex: '#2f2a29', name: 'Oro Rosa' }
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
        description: 'Cadena delicada con un colgante en forma de luna, perfecta para estilizar capas con otras piezas.',
        material: 'Plata de ley 925 bañado en oro',
        dimensions: 'Cadena 42 cm + extensor 4 cm',
        care: 'Almacenar en lugar seco y evitar humedad prolongada.',
        features: ['Acabado premium', 'Fácil de combinar', 'Textura suave'],
        mainImage: 'assets/images/collar-luna-1.png',
        hoverImage: 'assets/images/collar-luna-2.png',
        images: ['assets/images/collar-luna-1.png', 'assets/images/collar-luna-2.png'],
        colors: [
            { hex: '#e9d8be', name: 'Oro' },
            { hex: '#6c6257', name: 'Plata Envejecida' }
        ],
        featured: true,
        new: false
    }
];

const CONFIG = {
    siteName: 'MARENE',
    whatsappNumber: '573001234567', // Reemplázalo por tu número real cuando quieras
    whatsappIntro: 'Hola MARENE, quiero recibir atención personalizada para mi pedido.',
    whatsappOrderIntro: '✨ *NUEVO PEDIDO - MARENE* ✨\n\nHola, me gustaría realizar el siguiente pedido:',
    heroDescription: 'Elegancia sutil y diseño minimalista para acompañarte en cada ocasión.'
};

// Hacer disponible globalmente o por módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PRODUCTS, CATEGORIES, CONFIG };
} else {
    window.PRODUCTS = PRODUCTS;
    window.CATEGORIES = CATEGORIES;
    window.CONFIG = CONFIG;
}