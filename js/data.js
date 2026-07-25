// Configuración de Categorías Habilitadas en MARENE
window.CATEGORIES = [
    { id: "all", label: "Todos", enabled: true },
    { id: "collares", label: "Collares", enabled: true },
    { id: "cinturones", label: "Cinturones", enabled: true }
];

// Base de Datos de Productos
window.PRODUCTS = [
    {
        id: "cinturon-maria",
        name: "Cinturón María",
        price: 35000,
        category: "cinturones",
        categoryLabel: "Cinturones",
        image: "assets/images/maria1.JPG", 
        images: [
            "assets/images/maria1.JPG",
            "assets/images/maria2.JPG"
        ],
        colors: ["Blanco", "Dorado"],
        selectedColor: "Blanco",
        description: "",
        features: [
            "Referencia: MARIA",
            "Tejido artesanalmente flor por flor",
            "Elaborado con perlas delicadas y mostacillas seleccionadas",
            "Incluye dije colgante floral ajustable"
        ]
    },
    {
        id: "cinturon-AURA",
        name: "Cinturón Murano & Perlas",
        price: 40000,
        category: "cinturones",
        categoryLabel: "Cinturones",
        image: "assets/images/cinturon-murano1.jpg", 
        images: [
            "assets/images/cinturon-murano1.jpg"
        ],
        colors: ["otro", "Dorado", "Plateado"],
        selectedColor: "Multicolor",
        description: "",
        features: [
            "Referencia: CINTURÓN AURA",
            "Tejido artesanal a mano",
            "Elaborado con muranos, perlas y mostacillas",
            "Diseño sutil, elegante y ajustable"
        ]
    },
    {
        id: "collar-MAR",
        name: "Collar MAR",
        price: 30000,
        category: "collares",
        categoryLabel: "Collares",
        image: "assets/images/collarmar.jpg", 
        images: [
            "assets/images/collar-mostacillas1.jpg"
        ],
        colors: ["Blanco", "Dorado", "Rosa"],
        selectedColor: "Blanco",
        description: "",
        features: [
            "Referencia: COLLAR MAR",
            "Tejido artesanal a mano",
            "Elaborado con mostacillas",
        ]
    }
];
