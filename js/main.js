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
    const header = document.querySelector('.site-header');
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
    
    // Cerrar menú al hacer clic en un enlace móvil (para SPAs o anclas)
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
    
    // Alternar visibilidad de la barra de búsqueda
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
    
    // Cerrar buscador con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });
    
    // Lógica de filtrado en tiempo real
    const handleSearchInput = () => {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
            return;
        }
        
        if (!window.PRODUCTS) return;
        
        // Filtrar productos
        const filtered = window.PRODUCTS.filter(product => {
            return (
                product.name.toLowerCase().includes(query) ||
                product.categoryLabel.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
        }).slice(0, 5); // Limitar a 5 resultados sugeridos
        
        if (filtered.length === 0) {
            const safeQuery = escapeHTML(searchInput.value);
            resultsContainer.innerHTML = `
                <div style="padding: 1rem; text-align: center; font-size: 0.9rem; color: var(--color-text-secondary);">
                    No se encontraron productos para "${safeQuery}"
                </div>
            `;
            resultsContainer.style.display = 'block';
            return;
        }
        
        // Renderizar resultados
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

// 4. Animación de Revelado en Scroll (Intersection Observer)
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    if (reveals.length === 0) return;
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Dejar de observar una vez animado
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // viewport
        threshold: 0.15, // se activa cuando el 15% del elemento es visible
        rootMargin: "0px 0px -50px 0px" // activa ligeramente antes de entrar
    });
    
    reveals.forEach(element => {
        revealObserver.observe(element);
    });
}

// 5. Cargar Footer Dinámico de Derechos de Autor (Año actual)
function initFooterYear() {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// 6. Renderizar categorías dinámicamente según configuración global
function renderDynamicCategoryElements() {
    if (window.CATEGORIES && window.CATEGORIES.length) {
        const categoryFilterList = document.getElementById('category-filters');
        if (categoryFilterList) {
            categoryFilterList.innerHTML = '';
            const allItem = document.createElement('li');
            allItem.innerHTML = `<button class="filter-btn active" data-cat="all">Todos <span class="filter-count" id="count-all">0</span></button>`;
            categoryFilterList.appendChild(allItem);

            window.CATEGORIES.forEach(category => {
                if (!category.enabled) return;
                const item = document.createElement('li');
                item.innerHTML = `
                    <button class="filter-btn" data-cat="${category.id}">
                        ${category.label}
                        <span class="filter-count" id="count-${category.id}">0</span>
                    </button>
                `;
                categoryFilterList.appendChild(item);
            });
        }

        const homeCategoriesGrid = document.getElementById('home-categories-grid');
        if (homeCategoriesGrid) {
            homeCategoriesGrid.innerHTML = '';
            window.CATEGORIES.forEach(category => {
                if (!category.enabled) return;
                const card = document.createElement('a');
                card.className = 'category-card category-card-placeholder';
                card.href = '#productos';
                card.innerHTML = `
                    <div class="category-card-visual"></div>
                    <div class="category-overlay">
                        <h3 class="category-name">${category.label}</h3>
                        <span class="category-btn">Ver piezas</span>
                    </div>
                `;
                homeCategoriesGrid.appendChild(card);
            });

            // Si sólo hay una categoría habilitada, usar una sola tarjeta más grande en el home.
            const activeCount = window.CATEGORIES.filter(cat => cat.enabled).length;
            if (activeCount === 1) {
                homeCategoriesGrid.classList.add('single-category-grid');
            } else {
                homeCategoriesGrid.classList.remove('single-category-grid');
            }
        }
    }
}

// 7. Botón flotante de WhatsApp para toda la tienda
function createWhatsAppFloatButton() {
    if (document.querySelector('.whatsapp-fixed, .whatsapp-float')) return;

    const whatsappNumber = window.CONFIG && window.CONFIG.whatsappNumber ? window.CONFIG.whatsappNumber : '573001234567';
    const message = window.CONFIG && window.CONFIG.whatsappIntro ? window.CONFIG.whatsappIntro : 'Hola MARENE, quiero recibir atención personalizada para mi pedido.';
    const encodedMessage = encodeURIComponent(message);
    const button = document.createElement('a');
    button.id = 'whatsapp-float-btn';
    button.className = 'whatsapp-float';
    button.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.innerHTML = `
        <span class="whatsapp-float__icon" aria-hidden="true">+</span>
        <span class="whatsapp-float__label">Escríbenos</span>
    `;
    document.body.appendChild(button);
}

// Inicializar todas las funcionalidades al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Escuchar el scroll del header con throttle mediante requestAnimationFrame
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
    handleHeaderScroll(); // comprobar estado inicial
    
    // Inicializaciones
    initMobileMenu();
    initInstantSearch();
    initScrollReveal();
    initFooterYear();
    renderDynamicCategoryElements();
    createWhatsAppFloatButton();
});

// Función global para generar el HTML de una tarjeta de producto (Product Card)
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

function openProductDetail(productId) {
    const product = window.PRODUCTS.find(item => item.id === productId);
    if (!product) return;

    const overlay = document.getElementById('detail-overlay');
    const detailImage = document.getElementById('detail-image');
    const detailName = document.getElementById('detail-name');
    const detailSpecs = document.getElementById('detail-specs');
    const detailMeasures = document.getElementById('detail-measures');
    const detailPrice = document.getElementById('detail-price');
    const addCartBtn = document.getElementById('detail-add-to-cart');
    const buyNowBtn = document.getElementById('detail-buy-now');

    if (!overlay || !detailImage || !detailName || !detailSpecs || !detailMeasures || !detailPrice || !addCartBtn || !buyNowBtn) return;

    detailImage.src = product.mainImage;
    detailImage.alt = product.name;
    detailName.textContent = product.name;
    detailSpecs.textContent = product.material || product.description || 'Material no disponible';
    detailMeasures.textContent = product.dimensions || 'Medidas no disponibles';
    detailPrice.textContent = formatCOP(product.price);

    addCartBtn.onclick = () => {
        addToCart(product.id, 1);
        closeProductDetail();
    };

    buyNowBtn.onclick = () => {
        buyProductWhatsApp(product.id, 1);
    };

    overlay.classList.remove('hidden');
    document.body.classList.add('no-scroll');
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
