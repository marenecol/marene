/**
 * Catálogo principal de MARENE.
 *
 * Administra tu tienda desde este único archivo.
 * Para agregar un producto nuevo, solo edita `PRODUCTS` y copia las imágenes a `assets/images`.
 */

const CATEGORIES = [
    { id: 'collares', label: 'Collares', enabled: true },
    { id: 'aretes', label: 'Aretes', enabled: true },
    { id: 'pulseras', label: 'Pulseras', enabled: true },
    { id: 'anillos', label: 'Anillos', enabled: true },
    { id: 'sets', label: 'Sets', enabled: true }
];

// Productos reales de la tienda.
// No incluyas datos ficticios aquí.
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
        featured: true,
        new: false
    },
    {
        id: 'aretes-cascade',
        name: 'Aretes Cascade',
        category: 'aretes',
        categoryLabel: 'Aretes',
        price: 89000,
        rating: 4.7,
        reviewsCount: 21,
        description: 'Aretes en caída con detalle de cadenas finas que aportan movimiento y sofisticación al rostro.',
        material: 'Latón con baño de oro',
        dimensions: 'Largo 5 cm',
        care: 'Limpiar con paño suave y guardar en funda individual.',
        features: ['Ligero', 'Movimiento natural', 'Acabado brillante'],
        mainImage: 'assets/images/aretes-cascade-1.png',
        hoverImage: 'assets/images/aretes-cascade-2.png',
        images: ['assets/images/aretes-cascade-1.png', 'assets/images/aretes-cascade-2.png'],
        featured: false,
        new: true
    },
    {
        id: 'aretes-solstice',
        name: 'Aretes Solstice',
        category: 'aretes',
        categoryLabel: 'Aretes',
        price: 76000,
        rating: 4.6,
        reviewsCount: 14,
        description: 'Aretes modernos de silueta geométrica que combinan brillo y líneas limpias en un diseño atemporal.',
        material: 'Plata de ley 925 con baño de oro',
        dimensions: 'Largo 4 cm',
        care: 'Evitar productos químicos y pulir regularmente para mantener su brillo.',
        features: ['Diseño contemporáneo', 'Cómodos de llevar', 'Ideal para looks de día y noche'],
        mainImage: 'assets/images/aretes-solstice-1.png',
        hoverImage: 'assets/images/aretes-solstice-2.png',
        images: ['assets/images/aretes-solstice-1.png', 'assets/images/aretes-solstice-2.png'],
        featured: false,
        new: false
    },
    {
        id: 'pulsera-perlas',
        name: 'Pulsera Perlas',
        category: 'pulseras',
        categoryLabel: 'Pulseras',
        price: 105000,
        rating: 4.8,
        reviewsCount: 10,
        description: 'Pulsera con perlas sintéticas y detalles dorados, combinando romanticismo con delicadeza moderna.',
        material: 'Aleación con baño de oro y perlas sintéticas',
        dimensions: 'Circunferencia 18 cm',
        care: 'No sumergir en agua y guardar separada de otras joyas.',
        features: ['Estilo femenino', 'Cierre ajustable', 'Fácil de combinar'],
        mainImage: 'assets/images/pulsera-perlas-1.png',
        hoverImage: 'assets/images/pulsera-perlas-2.png',
        images: ['assets/images/pulsera-perlas-1.png', 'assets/images/pulsera-perlas-2.png'],
        featured: true,
        new: false
    },
    {
        id: 'pulsera-twist',
        name: 'Pulsera Twist',
        category: 'pulseras',
        categoryLabel: 'Pulseras',
        price: 83000,
        rating: 4.5,
        reviewsCount: 8,
        description: 'Pulsera trenzada con un acabado brillante que aporta textura y estilo discreto a tu stack de joyas.',
        material: 'Aleación bañada en oro',
        dimensions: 'Circunferencia 17.5 cm',
        care: 'Mantener alejada de líquidos y productos de limpieza.',
        features: ['Estilo texturizado', 'Fácil de combinar', 'Hecho para uso diario'],
        mainImage: 'assets/images/pulsera-twist-1.png',
        hoverImage: 'assets/images/pulsera-twist-2.png',
        images: ['assets/images/pulsera-twist-1.png', 'assets/images/pulsera-twist-2.png'],
        featured: false,
        new: true
    },
    {
        id: 'anillo-solitaire',
        name: 'Anillo Solitaire',
        category: 'anillos',
        categoryLabel: 'Anillos',
        price: 139000,
        rating: 4.9,
        reviewsCount: 22,
        description: 'Anillo clásico con piedra central minimalista, perfecto para combinar con otros anillos finos.',
        material: 'Plata de ley 925 con baño de oro',
        dimensions: 'Tallas disponibles: 6, 7, 8',
        care: 'Guarda el anillo en lugar seco y limpia con un paño suave.',
        features: ['Silueta clásica', 'Acabado duradero', 'Ajuste cómodo'],
        mainImage: 'assets/images/anillo-solitaire-1.png',
        hoverImage: 'assets/images/anillo-solitaire-2.png',
        images: ['assets/images/anillo-solitaire-1.png', 'assets/images/anillo-solitaire-2.png'],
        featured: true,
        new: false
    },
    {
        id: 'anillo-twist',
        name: 'Anillo Twist',
        category: 'anillos',
        categoryLabel: 'Anillos',
        price: 99000,
        rating: 4.4,
        reviewsCount: 9,
        description: 'Anillo con trenza delicada, ideal para texturizar tu look con un toque elegante y cotidiano.',
        material: 'Latón con baño de oro',
        dimensions: 'Tallas disponibles: 6, 7, 8',
        care: 'Evita golpes y almacenamiento con joyas pesadas.',
        features: ['Diseño trenzado', 'Acabado pulido', 'Perfecto para layering'],
        mainImage: 'assets/images/anillo-twist-1.png',
        hoverImage: 'assets/images/anillo-twist-2.png',
        images: ['assets/images/anillo-twist-1.png', 'assets/images/anillo-twist-2.png'],
        featured: false,
        new: true
    },
    {
        id: 'set-celeste',
        name: 'Set Celeste',
        category: 'sets',
        categoryLabel: 'Sets',
        price: 229000,
        rating: 4.9,
        reviewsCount: 15,
        description: 'Set de collar y aretes con detalles brillantes que combinan para looks sofisticados sin esfuerzo.',
        material: 'Latón con baño de oro y detalles en cristal',
        dimensions: 'Collar 45 cm + extensor 5 cm, Aretes 4 cm',
        care: 'Limpiar con paño suave y evitar el contacto con perfumes.',
        features: ['Combinación perfecta', 'Acabado femenino', 'Regalo ideal'],
        mainImage: 'assets/images/set-celeste-1.png',
        hoverImage: 'assets/images/set-celeste-2.png',
        images: ['assets/images/set-celeste-1.png', 'assets/images/set-celeste-2.png'],
        featured: true,
        new: false
    },
    {
        id: 'set-luxe',
        name: 'Set Luxe',
        category: 'sets',
        categoryLabel: 'Sets',
        price: 245000,
        rating: 4.8,
        reviewsCount: 11,
        description: 'Set premium con collar y pulsera a juego, diseñado para ocasiones especiales con un brillo sobrio.',
        material: 'Plata de ley 925 con baño de oro',
        dimensions: 'Collar 45 cm + extensor 5 cm, Pulsera 18 cm',
        care: 'Guardar en un lugar seco y evitar roces con superficies ásperas.',
        features: ['Diseño elegante', 'Set coordinado', 'Acabado duradero'],
        mainImage: 'assets/images/set-luxe-1.png',
        hoverImage: 'assets/images/set-luxe-2.png',
        images: ['assets/images/set-luxe-1.png', 'assets/images/set-luxe-2.png'],
        featured: false,
        new: false
    }
];

const CONFIG = {
    siteName: 'MARENE',
    whatsappNumber: '573001234567',
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
