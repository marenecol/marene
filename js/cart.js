// Lógica del Carrito de Compras para MARENE (Con Soporte de Color y Cantidad)

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
        return product ? { ...product, quantity: item.quantity, selectedColor: item.color || 'Único' } : null;
    }).filter(item => item !== null);
}

// Agregar producto al carrito (Ahora guarda el color)
function addToCart(productId, quantity = 1, color = 'Único') {
    // Buscamos si ya existe el mismo producto con el mismo color
    const existingItem = cart.find(item => item.id === productId && item.color === color);
    
    if (existingItem) {
        existingItem.quantity += parseInt(quantity, 10);
    } else {
        cart.push({ id: productId, quantity: parseInt(quantity, 10), color: color });
    }
    
    saveCart();
    openCartDrawer();
}

// Eliminar producto del carrito (Maneja id y color)
function removeFromCart(productId, color = 'Único') {
    cart = cart.filter(item => !(item.id === productId && item.color === color));
    saveCart();
}

// Actualizar cantidad desde el carrito lateral
function updateQuantity(productId, color, quantity) {
    const item = cart.find(item => item.id === productId && item.color === color);
    if (item) {
        item.quantity = parseInt(quantity, 10);
        if (item.quantity <= 0) {
            removeFromCart(productId, color);
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

// Actualizar la interfaz del carrito (Muestra el contador dinámico mi carrito (X))
function updateCartUI() {
    const badges = document.querySelectorAll('.cart-badge-count');
    const count = getCartCount();
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });

    const cartItemsContainer = document.getElementById('cart-drawer-items');
    if (!cartItemsContainer) return;

    const items = getCartItems();
    const total = getCartTotal();

    if (items.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty-message" style="text-align: center; padding: 2rem; color: #777;">
                <p>Tu carrito está vacío</p>
                <a href="#productos" class="btn btn-secondary" onclick="closeCartDrawer()" style="text-decoration: underline; color: #111;">Explorar Colección</a>
            </div>
        `;
        const footer = document.querySelector('.cart-drawer-footer');
        if (footer) footer.style.display = 'none';
    } else {
        const footer = document.querySelector('.cart-drawer-footer');
        if (footer) footer.style.display = 'block';

        let html = '';
        items.forEach(item => {
            html += `
                <div class="cart-item" data-id="${item.id}" data-color="${item.selectedColor}" style="display: flex; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #f2f2f2;">
                    <div class="cart-item-image" style="width: 70px; height: 70px; background: #f7f5f0; border-radius: 0.5rem; overflow: hidden;">
                        <img src="${item.mainImage || ''}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="cart-item-details" style="flex: 1;">
                        <div class="cart-item-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <h4 class="cart-item-title" style="margin: 0; font-size: 0.95rem; text-transform: uppercase;">${item.name}</h4>
                            <button class="cart-item-remove" onclick="removeFromCart('${item.id}', '${item.selectedColor}')" style="color: #ff4d4d; font-size: 0.8rem;">Eliminar</button>
                        </div>
                        <p class="cart-item-color" style="margin: 0.2rem 0; font-size: 0.85rem; color: #666;">Color: ${item.selectedColor}</p>
                        <div class="cart-item-actions" style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                            <div class="quantity-selector" style="display: flex; align-items: center; gap: 0.5rem; background: #f4f4f4; padding: 0.2rem 0.5rem; border-radius: 999px;">
                                <button onclick="updateQuantity('${item.id}', '${item.selectedColor}', ${item.quantity - 1})" style="font-weight: bold;">-</button>
                                <span class="qty-val">${item.quantity}</span>
                                <button onclick="updateQuantity('${item.id}', '${item.selectedColor}', ${item.quantity + 1})" style="font-weight: bold;">+</button>
                            </div>
                            <span class="cart-item-price" style="font-weight: bold; font-size: 0.9rem;">${formatCOP(item.price * item.quantity)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        cartItemsContainer.innerHTML = html;

        const subtotalEl = document.getElementById('cart-subtotal-val');
        if (subtotalEl) {
            subtotalEl.textContent = formatCOP(total);
        }
    }
}

// Proceder al checkout por WhatsApp (Recopila cantidad, color y datos - image_12.png)
function checkoutWhatsApp() {
    const items = getCartItems();
    if (items.length === 0) return;

    const phoneNumber = '573001234567'; // Número de prueba para Colombia
    let message = `✨ *NUEVO PEDIDO - MARENE* ✨\n\nHola, me gustaría realizar el siguiente pedido desde el carrito:\n\n`;
    
    items.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        message += `   - Color elegido: ${item.selectedColor}\n`;
        message += `   - Cantidad: ${item.quantity}\n`;
        message += `   - Subtotal: ${formatCOP(item.price * item.quantity)}\n\n`;
    });
    
    const total = getCartTotal();
    message += `💰 *TOTAL A PAGAR:* ${formatCOP(total)}\n\n`;
    message += `📝 *Datos de envío:*\n`;
    message += `- Nombre completo:\n`;
    message += `- Ciudad / Departamento:\n`;
    message += `- Dirección:\n`;
    message += `- Teléfono / WhatsApp:\n\n`;
    message += `¿Me indicas los pasos para el pago? ¡Muchas gracias! 🤍`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Botón "Comprar ahora" directo de la ficha del producto (image_11.png)
function buyProductWhatsApp(productId, quantity = 1, color = 'Único') {
    if (!window.PRODUCTS || !productId) return;
    const product = window.PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const phoneNumber = '573001234567';
    let message = `Hola MARENE, quiero hacer el pedido de este producto ahora mismo:\n\n`;
    message += `*${product.name}*\n`;
    message += `- Color: ${color}\n`;
    message += `- Cantidad: ${quantity}\n`;
    message += `- Precio total: ${formatCOP(product.price * quantity)}\n\n`;
    message += 'Por favor indícame los pasos para confirmar el envío y el pago. Gracias. 🤍';

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Inicializar cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    
    const closeBtn = document.getElementById('cart-close-btn');
    const overlay = document.getElementById('cart-overlay');
    
    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
    if (overlay) overlay.addEventListener('click', closeCartDrawer);
    
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