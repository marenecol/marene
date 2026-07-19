// Lógica para la página de Catálogo - MARENE

let activeCategory = 'all';
let searchQuery = '';
let currentSort = 'newest';
let isFavoritesView = false;

function isCategoryEnabled(categoryId) {
    if (!window.CATEGORIES) return true;
    const category = window.CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.enabled : false;
}

function getEnabledCategoryIds() {
    if (!window.CATEGORIES) return [];
    return window.CATEGORIES.filter(cat => cat.enabled).map(cat => cat.id);
}

// Obtener parámetros de la URL para filtros iniciales
function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    
    // Filtro de Categoría
    const catParam = params.get('cat');
    if (catParam && isCategoryEnabled(catParam)) {
        activeCategory = catParam;
    }
    
    // Vista especial de favoritos
    const showParam = params.get('show');
    if (showParam === 'favorites') {
        isFavoritesView = true;
    }
}

// Inicializar la interfaz del catálogo
function initCatalog() {
    parseUrlParams();
    
    // Configurar listeners de los botones de categoría
    const categoryButtons = document.querySelectorAll('.filter-btn');
    categoryButtons.forEach(btn => {
        const cat = btn.getAttribute('data-cat');
        
        // Activar el botón correspondiente
        if (cat === activeCategory && !isFavoritesView) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Desactivar vista de favoritos si hace clic en otra categoría
            isFavoritesView = false;
            
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            activeCategory = cat;
            
            // Actualizar URL sin recargar la página
            const newUrl = cat === 'all' ? 'catalogo.html' : `catalogo.html?cat=${cat}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
            
            applyFilters();
            
            // Cerrar sidebar en móvil si está abierto
            const sidebar = document.getElementById('filter-sidebar');
            if (sidebar) sidebar.classList.remove('active');
        });
    });

    // Configurar buscador del catálogo
    const searchInput = document.getElementById('catalog-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }

    // Configurar selector de ordenamiento
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            applyFilters();
        });
    }

    // Configurar toggle de filtros en móvil
    const mobileFilterBtn = document.getElementById('mobile-filter-btn');
    const sidebar = document.getElementById('filter-sidebar');
    if (mobileFilterBtn && sidebar) {
        mobileFilterBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Calcular conteos iniciales de categorías
    updateCategoryCounts();
    
    // Aplicar filtros por primera vez
    applyFilters();
}

// Actualizar los números de conteo al lado de cada categoría
function updateCategoryCounts() {
    if (!window.PRODUCTS) return;
    
    const enabledCategoryIds = getEnabledCategoryIds();
    const countAllEl = document.getElementById('count-all');
    if (countAllEl) {
        const total = window.PRODUCTS.filter(product => enabledCategoryIds.includes(product.category)).length;
        countAllEl.textContent = total;
    }

    enabledCategoryIds.forEach(cat => {
        const el = document.getElementById(`count-${cat}`);
        if (el) {
            const count = window.PRODUCTS.filter(p => p.category === cat).length;
            el.textContent = count;
        }
    });
}

// Aplicar filtros en memoria sobre los productos y ordenar
function applyFilters() {
    if (!window.PRODUCTS) return;
    
    let filteredList = [...window.PRODUCTS];
    
    // 1. Filtrar si es vista de Favoritos
    if (isFavoritesView) {
        filteredList = filteredList.filter(product => {
            return window.isFavorite ? window.isFavorite(product.id) : false;
        });
        
        // Ajustar breadcrumbs y títulos
        const breadcrumbEl = document.getElementById('breadcrumb-current');
        if (breadcrumbEl) breadcrumbEl.textContent = 'Favoritos';
        
        const categoryButtons = document.querySelectorAll('.filter-btn');
        categoryButtons.forEach(btn => btn.classList.remove('active'));
    } else {
        const breadcrumbEl = document.getElementById('breadcrumb-current');
        if (breadcrumbEl) breadcrumbEl.textContent = 'Catálogo';
        
            // 2. Filtrar por categoría
        if (activeCategory !== 'all') {
            filteredList = filteredList.filter(product => product.category === activeCategory);
        }
        // Siempre aplicar habilitación de categorías al catálogo
        filteredList = filteredList.filter(product => isCategoryEnabled(product.category));
    }
    
    // 3. Filtrar por término de búsqueda
    if (searchQuery.length > 0) {
        filteredList = filteredList.filter(product => {
            return (
                product.name.toLowerCase().includes(searchQuery) ||
                product.categoryLabel.toLowerCase().includes(searchQuery) ||
                product.description.toLowerCase().includes(searchQuery)
            );
        });
    }
    
    // 4. Ordenar los resultados
    sortProducts(filteredList);
    
    // 5. Mostrar insignias de filtros activos
    renderActiveFilterBadges();
    
    // 6. Renderizar en el grid
    renderProductsGrid(filteredList);
}

// Ordenar la lista filtrada in-place
function sortProducts(list) {
    switch (currentSort) {
        case 'price-asc':
            list.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            list.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            // Calificación descendente, luego cantidad de reviews
            list.sort((a, b) => (b.rating * b.reviewsCount) - (a.rating * a.reviewsCount));
            break;
        case 'newest':
        default:
            // Productos marcados como "new" primero, luego orden original
            list.sort((a, b) => {
                if (a.new && !b.new) return -1;
                if (!a.new && b.new) return 1;
                return 0;
            });
            break;
    }
}

// Renderizar badges informativas de filtros
function renderActiveFilterBadges() {
    const row = document.getElementById('active-filters-row');
    if (!row) return;
    
    let html = '';
    
    if (isFavoritesView) {
        html += `
            <span class="active-filter-badge">
                Solo Favoritos
                <button onclick="clearFavoritesFilter()">&times;</button>
            </span>
        `;
    } else if (activeCategory !== 'all') {
        const catLabel = activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
        html += `
            <span class="active-filter-badge">
                Categoría: ${catLabel}
                <button onclick="clearCategoryFilter()">&times;</button>
            </span>
        `;
    }
    
    if (searchQuery.length > 0) {
        html += `
            <span class="active-filter-badge">
                Búsqueda: "${searchQuery}"
                <button onclick="clearSearchFilter()">&times;</button>
            </span>
        `;
    }
    
    if (html.length > 0) {
        row.innerHTML = html + `<button class="clear-filters-btn" onclick="clearAllFilters()">Limpiar todo</button>`;
        row.style.display = 'flex';
    } else {
        row.style.display = 'none';
        row.innerHTML = '';
    }
}

// Funciones para limpiar filtros específicos
window.clearCategoryFilter = function() {
    activeCategory = 'all';
    const categoryButtons = document.querySelectorAll('.filter-btn');
    categoryButtons.forEach(btn => {
        if (btn.getAttribute('data-cat') === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    const newUrl = 'catalogo.html';
    window.history.pushState({ path: newUrl }, '', newUrl);
    applyFilters();
};

window.clearSearchFilter = function() {
    searchQuery = '';
    const searchInput = document.getElementById('catalog-search');
    if (searchInput) searchInput.value = '';
    applyFilters();
};

window.clearFavoritesFilter = function() {
    isFavoritesView = false;
    activeCategory = 'all';
    const categoryButtons = document.querySelectorAll('.filter-btn');
    categoryButtons.forEach(btn => {
        if (btn.getAttribute('data-cat') === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    const newUrl = 'catalogo.html';
    window.history.pushState({ path: newUrl }, '', newUrl);
    applyFilters();
};

window.clearAllFilters = function() {
    activeCategory = 'all';
    searchQuery = '';
    isFavoritesView = false;
    
    const searchInput = document.getElementById('catalog-search');
    if (searchInput) searchInput.value = '';
    
    const categoryButtons = document.querySelectorAll('.filter-btn');
    categoryButtons.forEach(btn => {
        if (btn.getAttribute('data-cat') === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    const newUrl = 'catalogo.html';
    window.history.pushState({ path: newUrl }, '', newUrl);
    applyFilters();
};

// Renderizar la lista de productos en el grid del catálogo
function renderProductsGrid(products) {
    const grid = document.getElementById('catalog-products-grid');
    const countEl = document.getElementById('results-count');
    
    if (!grid) return;
    
    if (countEl) {
        countEl.textContent = products.length === 1 
            ? "1 producto encontrado" 
            : `${products.length} productos encontrados`;
    }
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 5rem 0; width: 100%;">
                <p style="font-family: var(--font-title); font-style: italic; font-size: 1.3rem; margin-bottom: 1.5rem; color: var(--color-text-secondary);">
                    No encontramos piezas que coincidan con tu búsqueda.
                </p>
                <button onclick="clearAllFilters()" class="btn btn-secondary">Ver todo el catálogo</button>
            </div>
        `;
        return;
    }
    
    let html = '';
    products.forEach(product => {
        // AJUSTE CLAVE: Corregimos la propiedad image del producto antes de enviarlo al HTML 
        // para asegurar que use la primera foto de la lista (que sí tiene el .JPG correcto)
        if (product.images && product.images.length > 0) {
            product.image = product.images[0];
        }
        html += window.createProductCardHTML(product);
    });
    grid.innerHTML = html;
}

// Inicializar catálogo al cargar
document.addEventListener('DOMContentLoaded', () => {
    initCatalog();
    
    // Refrescar catálogo si cambian los favoritos
    window.addEventListener('favoritesUpdated', () => {
        if (isFavoritesView) {
            applyFilters();
        } else {
            // Sincronizar estados visuales de corazones
            const heartButtons = document.querySelectorAll('.product-card .fav-btn');
            heartButtons.forEach(btn => {
                const id = btn.getAttribute('data-id');
                const isFav = window.isFavorite ? window.isFavorite(id) : false;
                const path = btn.querySelector('path');
                if (isFav) {
                    btn.classList.add('active');
                    if (path) path.setAttribute('fill', 'currentColor');
                } else {
                    btn.classList.remove('active');
                    if (path) path.setAttribute('fill', 'none');
                }
            });
        }
    });
});
