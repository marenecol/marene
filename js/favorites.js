// Lógica de Favoritos para MARENE

const FAV_STORAGE_KEY = 'marene_favorites';
let favorites = [];

// Inicialización de Favoritos
function initFavorites() {
    try {
        const storedFavs = localStorage.getItem(FAV_STORAGE_KEY);
        favorites = storedFavs ? JSON.parse(storedFavs) : [];
    } catch (e) {
        console.error("Error al cargar favoritos de localStorage:", e);
        favorites = [];
    }
    dispatchFavoritesUpdate();
}

// Guardar en localStorage
function saveFavorites() {
    try {
        localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
        console.error("Error al guardar favoritos en localStorage:", e);
    }
    dispatchFavoritesUpdate();
}

// Despachar evento de actualización
function dispatchFavoritesUpdate() {
    const event = new CustomEvent('favoritesUpdated', {
        detail: {
            favorites: getFavoritesItems(),
            count: getFavoritesCount()
        }
    });
    window.dispatchEvent(event);
    updateFavoritesUI();
}

// Alternar producto en favoritos
function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    
    if (index > -1) {
        favorites.splice(index, 1); // Quitar
    } else {
        favorites.push(productId); // Agregar
    }
    
    saveFavorites();
    
    // Animar el botón de favorito correspondiente en la interfaz si existe
    const favButtons = document.querySelectorAll(`.fav-btn[data-id="${productId}"]`);
    favButtons.forEach(btn => {
        btn.classList.add('heart-beat');
        setTimeout(() => btn.classList.remove('heart-beat'), 400);
    });
}

// Comprobar si un producto es favorito
function isFavorite(productId) {
    return favorites.includes(productId);
}

// Obtener cantidad de favoritos
function getFavoritesCount() {
    return favorites.length;
}

// Obtener lista completa de productos favoritos
function getFavoritesItems() {
    if (!window.PRODUCTS) return [];
    return favorites.map(id => {
        return window.PRODUCTS.find(p => p.id === id);
    }).filter(item => item !== undefined);
}

// Actualizar interfaces relacionadas a favoritos
function updateFavoritesUI() {
    // 1. Actualizar insignias de conteo en la cabecera
    const badges = document.querySelectorAll('.fav-badge-count');
    const count = getFavoritesCount();
    badges.forEach(badge => {
        badge.textContent = count;
        if (count > 0) {
            badge.style.display = 'inline-flex';
        } else {
            badge.style.display = 'none';
        }
    });

    // 2. Sincronizar clases activas en los botones de corazones del catálogo
    const heartButtons = document.querySelectorAll('.fav-btn');
    heartButtons.forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (id && isFavorite(id)) {
            btn.classList.add('active');
            const path = btn.querySelector('path');
            if (path) {
                // Rellenar corazón
                path.setAttribute('fill', 'currentColor');
            }
        } else {
            btn.classList.remove('active');
            const path = btn.querySelector('path');
            if (path) {
                // Corazón outline
                path.setAttribute('fill', 'none');
            }
        }
    });
    
    // 3. Renderizar vista de favoritos si estamos en la página de favoritos
    const favContainer = document.getElementById('favorites-list-container');
    if (favContainer) {
        renderFavoritesList(favContainer);
    }
}

// Renderizar la lista de favoritos en una página dedicada
function renderFavoritesList(container) {
    const items = getFavoritesItems();
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-favorites-view" style="text-align: center; padding: var(--spacing-xl) 0;">
                <p style="margin-bottom: var(--spacing-md);">No tienes productos en tu lista de deseos todavía.</p>
                <a href="#productos" class="btn btn-secondary">Ver collares</a>
            </div>
        `;
        return;
    }
    
    let html = '<div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--spacing-lg); width: 100%;">';
    
    items.forEach(product => {
        html += window.createProductCardHTML(product);
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Inicializar cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    initFavorites();
});

// Registrar funciones globalmente
window.toggleFavorite = toggleFavorite;
window.isFavorite = isFavorite;
window.getFavoritesCount = getFavoritesCount;
window.getFavoritesItems = getFavoritesItems;
