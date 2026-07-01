// Lógica del Carrito de Compras para MARENE

const CART_STORAGE_KEY = 'marene_cart';
let cart = [];

// Inicialización del Carrito
function initCart() {
    try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        cart = storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
        console.error("Error al cargar el carrito de localStorage:", e);
        cart = [];
    }
    dispatchCartUpdate();
}

// Guardar en localStorage
function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
        console.error("Error al guardar el carrito en localStorage:", e);
    }
    dispatchCartUpdate();
}

// Despachar evento personalizado para notificar cambios
function dispatchCartUpdate() {
    const event = new CustomEvent('cartUpdated', {
        detail: {
            cart: getCartItems(),
            count: getCartCount(),
            total: getCartTotal()
        }
    });
    window.dispatchEvent(event);
    updateCartUI();
}

// Obtener items con detalles completos del producto
function getCartItems() {
    if (!window.PRODUCTS) return [];
    return cart.map(item => {
        const product = window.PRODUCTS.find(p => p.id === item.id);
        return product ? { ...product, quantity: item.quantity } : null;
    }).filter(item => item !== null);
}

// Agregar producto al carrito
function addToCart(productId, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity: quantity });
    }
    
    saveCart();
    openCartDrawer();
}

// Eliminar producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

// Actualizar cantidad
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(quantity, 10);
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
        }
    }
}

// Obtener total de unidades en el carrito
function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Obtener precio total acumulado
function getCartTotal() {
    const items = getCartItems();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Limpiar carrito
function clearCart() {
    cart = [];
    saveCart();
}

// Formateador de moneda en pesos colombianos COP
function formatCOP(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Abrir el carrito lateral (Drawer)
function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
        drawer.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
    }
}

// Cerrar el carrito lateral (Drawer)
function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

// Actualizar la interfaz del carrito (Drawer y Badges)
function updateCartUI() {
    // 1. Actualizar badges de conteo en la página
    const badges = document.querySelectorAll('.cart-badge-count');
    const count = getCartCount();
    badges.forEach(badge => {
        badge.textContent = count;
        if (count > 0) {
            badge.style.display = 'inline-flex';
        } else {
            badge.style.display = 'none';
        }
    });

    // 2. Renderizar los productos dentro del drawer si existe el contenedor
    const cartItemsContainer = document.getElementById('cart-drawer-items');
    if (!cartItemsContainer) return;

    const items = getCartItems();
    const total = getCartTotal();

    if (items.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty-message">
                <p>Tu carrito está vacío</p>
                <a href="#productos" class="btn btn-secondary" onclick="closeCartDrawer()">Explorar Colección</a>
            </div>
        `;
        // Ocultar sección de totales si está vacío
        const footer = document.querySelector('.cart-drawer-footer');
        if (footer) footer.style.display = 'none';
    } else {
        const footer = document.querySelector('.cart-drawer-footer');
        if (footer) footer.style.display = 'block';

        let html = '';
        items.forEach(item => {
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.mainImage}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-header">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="Eliminar artículo">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <p class="cart-item-category">${item.categoryLabel}</p>
                        <div class="cart-item-actions">
                            <div class="quantity-selector">
                                <button class="qty-btn qty-minus" onclick="updateQuantity('${item.id}', ${item.quantity - 1})" aria-label="Disminuir cantidad">-</button>
                                <span class="qty-val">${item.quantity}</span>
                                <button class="qty-btn qty-plus" onclick="updateQuantity('${item.id}', ${item.quantity + 1})" aria-label="Aumentar cantidad">+</button>
                            </div>
                            <span class="cart-item-price">${formatCOP(item.price * item.quantity)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        cartItemsContainer.innerHTML = html;

        // Actualizar el subtotal en el footer
        const subtotalEl = document.getElementById('cart-subtotal-val');
        if (subtotalEl) {
            subtotalEl.textContent = formatCOP(total);
        }
    }
}

// Proceder al checkout por WhatsApp
function checkoutWhatsApp() {
    const items = getCartItems();
    if (items.length === 0) return;

    const phoneNumber = window.CONFIG && window.CONFIG.whatsappNumber ? window.CONFIG.whatsappNumber : '573001234567';
    const intro = window.CONFIG && window.CONFIG.whatsappOrderIntro ? window.CONFIG.whatsappOrderIntro : '✨ *NUEVO PEDIDO - MARENE* ✨\n\nHola, me gustaría realizar el siguiente pedido:';
    
    let message = `${intro}\n\n`;
    items.forEach((item, index) => {
        message += `${index + 1}. *${item.name}* (Cant: ${item.quantity})\n`;
        message += `   - Categoría: ${item.categoryLabel}\n`;
        message += `   - Subtotal: ${formatCOP(item.price * item.quantity)}\n\n`;
    });
    
    const total = getCartTotal();
    message += `💰 *TOTAL A PAGAR:* ${formatCOP(total)}\n\n`;
    message += `📝 *Datos de envío:*\n`;
    message += `- Nombre completo:\n`;
    message += `- Ciudad / Departamento:\n`;
    message += `- Dirección:\n`;
    message += `- Teléfono / WhatsApp:\n\n`;
    message += `¿Me puedes indicar los pasos para realizar el pago? Muchas gracias. 🤍`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

function buyProductWhatsApp(productId, quantity = 1) {
    if (!window.PRODUCTS || !productId) return;
    const product = window.PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const phoneNumber = window.CONFIG && window.CONFIG.whatsappNumber ? window.CONFIG.whatsappNumber : '573001234567';
    const intro = window.CONFIG && window.CONFIG.whatsappIntro ? window.CONFIG.whatsappIntro : 'Hola MARENE, me interesa este producto:';
    let message = `${intro}\n\n`;
    message += `*${product.name}*\n`;
    message += `Precio: ${formatCOP(product.price)}\n`;
    message += `Cantidad: ${quantity}\n`;
    message += `Categoría: ${product.categoryLabel}\n\n`;
    message += 'Por favor indícame los pasos para confirmar el pedido y realizar el pago. Gracias. 🤍';

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Inicializar cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    
    // Configurar listeners de cierre
    const closeBtn = document.getElementById('cart-close-btn');
    const overlay = document.getElementById('cart-overlay');
    
    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
    if (overlay) overlay.addEventListener('click', closeCartDrawer);
    
    // Configurar checkout button
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkoutWhatsApp);
    }
});

// Hacer funciones disponibles globalmente
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.formatCOP = formatCOP;
window.getCartCount = getCartCount;
window.getCartTotal = getCartTotal;
window.getCartItems = getCartItems;
window.buyProductWhatsApp = buyProductWhatsApp;
