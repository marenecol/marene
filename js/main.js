// Funcionalidades globales para MARENE

// Funciones Auxiliares
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// 1. Sticky Header al hacer Scroll
function handleHeaderScroll() {
    const header = document.querySelector('.page-header');
    if (!header) return;
    
    if (window.scrollY > 30) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// 2. Control de Menú Móvil (Drawer Lateral)
function initMobileMenu() {
    const toggleBtn = document.getElementById('menu-toggle-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const overlay = document.getElementById('site-overlay');
    const closeBtn = document.getElementById('mobile-nav-close-btn');
    
    if (!toggleBtn || !drawer || !overlay) return;
    
    const openMenu = () => {
        drawer.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
    };
    
    const closeMenu = () => {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };
    
    toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    
    const mobileLinks = drawer.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
}

// 3. Buscador Instantáneo
function initInstantSearch() {
    const searchBtn = document.getElementById('search-toggle-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close-btn');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    
    if (!searchBtn || !searchOverlay || !searchInput || !resultsContainer) return;
    
    const openSearch = () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
    };
    
    const closeSearch = () => {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
    };
    
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (searchOverlay.classList.contains('active')) {
            closeSearch();
        } else {
            openSearch();
        }
    });
    
    if (searchClose) searchClose.addEventListener('click', closeSearch);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });
    
    const handleSearchInput = () => {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
            return;
        }
        
        if (!window.PRODUCTS) return;
        
        const filtered = window.PRODUCTS.filter(product => {
            return (
                product.name.toLowerCase().includes(query) ||
                product.categoryLabel.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
        }).slice(0, 5);
        
        if (filtered.length === 0) {
            const safeQuery = escapeHTML(searchInput.value);
            resultsContainer.innerHTML = `
                <div style="padding: 1rem; text-align: center; font-size: 0.9rem; color: #777;">
                    No se encontraron collares para "${safeQuery}"
                </div>
            `;
            resultsContainer.style.display = 'block';
            return;
        }
        
        let html = '';
        filtered.forEach(product => {
            html += `
                <button type="button" class="search-result-item" onclick="document.getElementById('search-overlay').classList.remove('active'); openProductDetail('${product.id}')">
                    <img src="${product.mainImage}" alt="${product.name}">
                    <div class="search-result-info">
                        <h4>${product.name}</h4>
                        <p>${window.formatCOP ? window.formatCOP(product.price) : '$' + product.price}</p>
                    </div>
                </button>
            `;
        });
        
        resultsContainer.innerHTML = html;
        resultsContainer.style.display = 'block';
    };

    searchInput.addEventListener('input', debounce(handleSearchInput, 200));
}

// 4. Animación de Revelado en Scroll
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });
    
    reveals.forEach(element => {
        revealObserver.observe(element);
    });
}

// 5. Renderizar categorías dinámicamente según configuración global
function renderDynamicCategoryElements() {
    if (window.CATEGORIES && window.CATEGORIES.length) {
        const categoryFilterList = document.getElementById('category-filters');
        if (categoryFilterList) {
            categoryFilterList.innerHTML = '';
            const allItem = document.createElement('li');
            allItem.innerHTML = `<button class="filter-btn active" data-cat="all">Collares <span class="filter-count" id="count-all">0</span></button>`;
            categoryFilterList.appendChild(allItem);
        }
    }
}

// Inicializar todas las funcionalidades al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    let scrollTicker = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicker) {
            window.requestAnimationFrame(() => {
                handleHeaderScroll();
                scrollTicker = false;
            });
            scrollTicker = true;
        }
    });
    handleHeaderScroll();
    
    initMobileMenu();
    initInstantSearch();
    initScrollReveal();
    renderDynamicCategoryElements();
});

// Función global para generar la tarjeta de producto (Forzando 2 columnas móviles mediante clases)
function createProductCardHTML(product) {
    const formatFn = window.formatCOP || (val => `$${val}`);
    const image = product.mainImage || '';
    return `
        <button type="button" class="product-card" data-id="${product.id}" onclick="openProductDetail('${product.id}')">
            <div class="product-card-image">
                <img src="${image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-card-body">
                <p class="product-card-title">${product.name}</p>
                <p class="product-card-price">${formatFn(product.price)}</p>
            </div>
        </button>
    `;
}

function renderProductGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid || !window.PRODUCTS) return;
    grid.innerHTML = window.PRODUCTS.map(product => createProductCardHTML(product)).join('');
}

// NUEVA FUNCIÓN: Abre la vista detallada adaptada fielmente a los bocetos (image_11.png)
function openProductDetail(productId) {
    const product = window.PRODUCTS.find(item => item.id === productId);
    if (!product) return;

    const overlay = document.getElementById('detail-overlay');
    const detailContentContainer = document.querySelector('.detail-content');
    
    if (!overlay || !detailContentContainer) return;

    // Inyectamos dinámicamente los componentes solicitados en tu tablet: Carrusel secundario, selectores y textos plano.
    detailContentContainer.innerHTML = `
        <!-- Bloque izquierdo: Foto de producto y fila de miniaturas (Boceto image_11.png) -->
        <div class="detail-media-container" style="display: grid; gap: 0.8rem;">
            <img id="detail-image" class="detail-image" src="${product.mainImage}" alt="${product.name}" style="width: 100%; border-radius: 1.25rem; aspect-ratio: 1/1; object-fit: cover;">
            <div class="detail-thumbnails" style="display: flex; gap: 0.5rem; justify-content: flex-start;">
                ${(product.images || [product.mainImage]).map(imgUrl => `
                    <img src="${imgUrl}" alt="Miniatura" onclick="document.getElementById('detail-image').src='${imgUrl}'" style="width: 60px; height: 60px; object-fit: cover; border-radius: 0.5rem; cursor: pointer; border: 1px solid rgba(0,0,0,0.1);">
                `).join('')}
            </div>
        </div>

        <!-- Bloque derecho: Textos informativos, selector de color y cantidad (Boceto image_11.png) -->
        <div class="detail-info" style="display: grid; gap: 1rem; text-align: left;">
            <h2 id="detail-name" style="margin:0; font-size: 1.8rem; text-transform: uppercase;">${product.name}</h2>
            
            <div class="detail-meta">
                <div style="margin-bottom: 0.5rem;">
                    <p class="detail-meta-label" style="margin:0; font-weight:bold; color:#777; font-size:0.8rem; text-transform:uppercase;">Descripción</p>
                    <p class="detail-meta-text" style="margin:0.2rem 0; color:#444;">${product.description}</p>
                </div>
                <div style="margin-bottom: 0.5rem;">
                    <p class="detail-meta-label" style="margin:0; font-weight:bold; color:#777; font-size:0.8rem; text-transform:uppercase;">Especificaciones</p>
                    <p class="detail-meta-text" style="margin:0.2rem 0; color:#444;">${product.material || 'No especificado'}</p>
                </div>
                <div style="margin-bottom: 0.5rem;">
                    <p class="detail-meta-label" style="margin:0; font-weight:bold; color:#777; font-size:0.8rem; text-transform:uppercase;">Medidas</p>
                    <p class="detail-meta-text" style="margin:0.2rem 0; color:#444;">${product.dimensions || 'No especificado'}</p>
                </div>
            </div>

            <!-- Selector dinámico de Color con círculos (Boceto image_11.png) -->
            <div class="color-selection-container">
                <p style="margin: 0 0 0.4rem; font-weight: bold; color: #777; font-size: 0.8rem; text-transform: uppercase;">Color</p>
                <div style="display: flex; gap: 0.8rem;" id="color-circles-wrapper">
                    ${(product.colors || [{hex: '#c8a97b', name: 'Único'}]).map((col, idx) => `
                        <button type="button" class="color-circle-btn ${idx === 0 ? 'active' : ''}" data-color-name="${col.name}" onclick="selectColorBubble(this)" style="width: 28px; height: 28px; background: ${col.hex}; border-radius: 50%; border: ${idx === 0 ? '2px solid #111' : '1px solid rgba(0,0,0,0.2)'}; cursor: pointer; transform: ${idx === 0 ? 'scale(1.1)' : 'none'};"></button>
                    `).join('')}
                </div>
                <p id="selected-color-label" style="margin: 0.3rem 0 0; font-size: 0.85rem; color: #111;">Seleccionado: <strong>${product.colors ? product.colors[0].name : 'Único'}</strong></p>
            </div>

            <!-- Selector de cantidad integrado (Boceto image_11.png) -->
            <div class="quantity-selection-container">
                <p style="margin: 0 0 0.4rem; font-weight: bold; color: #777; font-size: 0.8rem; text-transform: uppercase;">Cantidad</p>
                <div style="display: flex; align-items: center; gap: 0.5rem; background: #f4f4f4; width: max-content; padding: 0.3rem 0.8rem; border-radius: 999px;">
                    <button type="button" onclick="let q = document.getElementById('detail-qty-val'); let v = parseInt(q.textContent); if(v > 1) q.textContent = v - 1;" style="font-weight:bold; font-size:1.1rem;">-</button>
                    <span id="detail-qty-val" style="font-weight:bold; min-width: 20px; text-align:center;">1</span>
                    <button type="button" onclick="let q = document.getElementById('detail-qty-val'); let v = parseInt(q.textContent); q.textContent = v + 1;" style="font-weight:bold; font-size:1.1rem;">+</button>
                </div>
            </div>

            <p id="detail-price" class="detail-price" style="margin:0; font-size:1.8rem; font-weight:bold;">${window.formatCOP(product.price)}</p>
            
            <div class="detail-actions" style="display: grid; gap: 0.6rem; margin-top: 0.5rem;">
                <button id="detail-add-to-cart" class="btn-secondary" type="button" style="width: 100%; border: 1px solid #111; padding: 0.8rem; border-radius: 999px; text-transform: uppercase; font-size: 0.85rem; font-weight: bold;">Agregar al carrito</button>
                <button id="detail-buy-now" class="btn-primary" type="button" style="width: 100%; background: #111; color: #fff; padding: 0.8rem; border-radius: 999px; text-transform: uppercase; font-size: 0.85rem; font-weight: bold;">Comprar ahora</button>
            </div>
        </div>
    `;

    // Vinculamos los eventos de los botones recolectando la información en tiempo de clic
    const addCartBtn = document.getElementById('detail-add-to-cart');
    const buyNowBtn = document.getElementById('detail-buy-now');

    addCartBtn.onclick = () => {
        const selectedColor = document.getElementById('selected-color-label').querySelector('strong').textContent;
        const selectedQty = parseInt(document.getElementById('detail-qty-val').textContent, 10);
        addToCart(product.id, selectedQty, selectedColor);
        closeProductDetail();
    };

    buyNowBtn.onclick = () => {
        const selectedColor = document.getElementById('selected-color-label').querySelector('strong').textContent;
        const selectedQty = parseInt(document.getElementById('detail-qty-val').textContent, 10);
        buyProductWhatsApp(product.id, selectedQty, selectedColor);
    };

    overlay.classList.remove('hidden');
    document.body.classList.add('no-scroll');
}

// Función auxiliar para manejar el clic visual de los círculos de colores
function selectColorBubble(element) {
    const wrapper = document.getElementById('color-circles-wrapper');
    const buttons = wrapper.querySelectorAll('.color-circle-btn');
    buttons.forEach(btn => {
        btn.style.border = '1px solid rgba(0,0,0,0.2)';
        btn.style.transform = 'none';
    });
    element.style.border = '2px solid #111';
    element.style.transform = 'scale(1.1)';
    
    const colorName = element.getAttribute('data-color-name');
    document.getElementById('selected-color-label').querySelector('strong').textContent = colorName;
}

function closeProductDetail() {
    const overlay = document.getElementById('detail-overlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    document.body.classList.remove('no-scroll');
}

function initShopPage() {
    renderProductGrid();
    const detailClose = document.getElementById('detail-close');
    const overlay = document.getElementById('detail-overlay');
    if (detailClose) {
        detailClose.addEventListener('click', closeProductDetail);
    }
    if (overlay) {
        overlay.addEventListener('click', event => {
            if (event.target === overlay) closeProductDetail();
        });
    }
}

window.createProductCardHTML = createProductCardHTML;
window.openProductDetail = openProductDetail;
window.closeProductDetail = closeProductDetail;
window.initShopPage = initShopPage;
window.selectColorBubble = selectColorBubble;
