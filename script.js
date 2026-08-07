let products = [];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

/* ===== CLOUDINARY CONFIG =====
   Creá una cuenta gratis en https://cloudinary.com
   Luego en Settings > Upload creá un "upload preset" con modo "Unsigned".
   Copiá tu Cloud name y el nombre del preset acá abajo.
   Las imágenes se suben directo desde el navegador a Cloudinary,
   y solo la URL optimizada se guarda en Firestore.
*/
const CLOUDINARY_CONFIG = {
    cloudName: 'djmkenlag',
    uploadPreset: 'ml_default'
};

function formatCOP(price) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
}

function getDiscount(p) {
    return p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
}

function createProductCard(p, wide = false) {
    const div = document.createElement('div');
    div.className = "product-card flex-none group snap-start bg-white overflow-hidden " + (wide ? "w-80 md:w-[22rem]" : "w-72 md:w-80");
    const discount = getDiscount(p);
    const priceHTML = p.originalPrice
        ? `<span class="original-price">${formatCOP(p.originalPrice)}</span> ${formatCOP(p.price)}`
        : formatCOP(p.price);
    const discountBadge = discount > 0 ? `<span class="product-badge discount">-${discount}%</span>` : "";
    const contentClass = wide ? "p-3" : "p-6";
    const titleClass = wide ? "text-base mb-1" : "text-lg mb-2";
    const priceClass = wide ? "text-base" : "text-lg";
    div.innerHTML = `
        <div class="relative overflow-hidden aspect-[4/3] bg-surface-container-low">
            <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
            <div class="absolute top-4 left-4">
                <span class="product-badge ${p.tag === 'Nuevo' ? 'nuevo' : p.tag === 'Oferta' ? 'oferta' : 'mas-vendido'}">${p.tag}</span>
            </div>
            ${discountBadge}
            <div class="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-white to-transparent">
                <button onclick="addToCart(${p.id})" class="w-full bg-on-surface text-surface py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary transition-soft shadow-lg">
                    Añadir a Bolsa
                </button>
            </div>
            <button onclick="openProductModal(${p.id})" class="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span class="material-symbols-outlined text-sm">visibility</span>
            </button>
        </div>
        <div class="${contentClass} text-center">
            <p class="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1 font-semibold">${Array.isArray(p.categories) ? p.categories.join(', ') : (p.category || '')}</p>
            <h4 class="font-display font-bold ${titleClass} text-on-surface group-hover:text-primary transition-colors cursor-pointer" onclick="openProductModal(${p.id})">${p.name}</h4>
            <p class="text-primary font-price ${priceClass} font-semibold">${priceHTML}</p>
        </div>
    `;
    return div;
}

function renderProducts() {
    const grids = {
        nuevos: document.getElementById('nuevosGrid'),
        ofertas: document.getElementById('ofertasGrid'),
        vendidos: document.getElementById('vendidosGrid'),
        electro: document.getElementById('electroGrid')
    };
    Object.values(grids).forEach(g => { if(g) g.innerHTML = '' });
    products.forEach(p => {
        if(p.tag === 'Nuevo' && grids.nuevos) grids.nuevos.appendChild(createProductCard(p, true));
        if(p.tag === 'Oferta' && grids.ofertas) grids.ofertas.appendChild(createProductCard(p, true));
        if(p.tag === 'Mas Vendido' && grids.vendidos) grids.vendidos.appendChild(createProductCard(p, true));
        if(grids.electro) grids.electro.appendChild(createProductCard(p));
    });
    updateCartCount();
    applyFilters();
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active-nav'));
    if(pageId === 'home') document.getElementById('nav-inicio')?.classList.add('active-nav');
    // Push hash for browser back/forward
    const hash = pageId === 'home' ? '' : pageId;
    if (window.location.hash.replace('#', '') !== hash) {
        history.pushState({ page: pageId }, '', hash ? '#' + hash : window.location.pathname);
    }
}

// Browser back/forward
window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'catalogo' || hash === 'electro') {
        showPage('electro');
    } else if (hash === 'admin') {
        checkAdminAccess();
    } else {
        showPage('home');
    }
});

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
}

function toggleFilter(btn) {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('span');
    content.classList.toggle('hidden');
    icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
}

const estanciaCategories = {
    cocina: ['electrodomesticos', 'lavado'],
    sala: ['televisores', 'electrodomesticos'],
    oficina: ['tecnologia', 'electrodomesticos'],
    dormitorio: ['electrodomesticos', 'aires'],
    bano: ['lavado'],
    lavado: ['lavado']
};

/* ===== PAGINACIÓN ===== */
const PAGE_SIZE = 20;
let currentPage = 1;

function applyFilters(resetPage = true) {
    if (resetPage) currentPage = 1;
    const query = document.getElementById('electroSearch')?.value?.toLowerCase() || '';
    const checkedEstancias = Array.from(document.querySelectorAll('.filter-sidebar input[type="checkbox"][value="cocina"], .filter-sidebar input[type="checkbox"][value="sala"], .filter-sidebar input[type="checkbox"][value="oficina"], .filter-sidebar input[type="checkbox"][value="dormitorio"], .filter-sidebar input[type="checkbox"][value="bano"], .filter-sidebar input[type="checkbox"][value="lavado"]')).filter(cb => cb.checked).map(cb => cb.value);
    const checkedTypes = Array.from(document.querySelectorAll('.filter-sidebar input[type="checkbox"][value="televisores"], .filter-sidebar input[type="checkbox"][value="aires"], .filter-sidebar input[type="checkbox"][value="electrodomesticos"], .filter-sidebar input[type="checkbox"][value="lavado"], .filter-sidebar input[type="checkbox"][value="tecnologia"]')).filter(cb => cb.checked).map(cb => cb.value);
    const priceRange = document.querySelector('input[name="price"]:checked')?.value;
    const grid = document.getElementById('electroGrid');
    if(!grid) return;

    const allowedCategories = new Set();
    checkedTypes.forEach(t => allowedCategories.add(t));

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(query);
        const productCategories = Array.isArray(p.categories) ? p.categories : (p.category ? [p.category] : []);
        const matchCat = allowedCategories.size === 0 || productCategories.some(c => allowedCategories.has(c));
        // Match estancias: if product has estancias array, use it; fall back to category mapping
        const matchEstancia = checkedEstancias.length === 0 ||
            (Array.isArray(p.estancias) && p.estancias.some(e => checkedEstancias.includes(e)));
        let matchPrice = true;
        if(priceRange && priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            matchPrice = p.price >= min && p.price <= max;
        }
        return matchSearch && matchCat && matchPrice && matchEstancia;
    });
    grid.innerHTML = '';
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);
    pageItems.forEach(p => grid.appendChild(createProductCard(p)));
    const countEl = document.getElementById('productCount');
    if(countEl) countEl.innerText = filtered.length;
    renderPagination(totalPages, filtered.length);
}

function changePage(page) {
    currentPage = page;
    applyFilters(false);
}

function renderPagination(totalPages, totalItems) {
    const container = document.getElementById('pagination');
    if (!container) return;
    if (totalPages <= 1) { container.innerHTML = ''; return; }
    let html = '<div class="flex items-center justify-center gap-2 mt-10">';
    html += `<button class="px-4 py-2 text-xs font-semibold uppercase tracking-widest border border-outline-variant bg-surface hover:bg-surface-container-high transition-soft ${currentPage === 1 ? 'opacity-40 pointer-events-none' : ''}" onclick="changePage(${currentPage - 1})">← Anterior</button>`;
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
            html += `<button class="w-10 h-10 text-xs font-semibold border ${i === currentPage ? 'bg-on-surface text-surface border-on-surface' : 'border-outline-variant bg-surface hover:bg-surface-container-high'} transition-soft" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<span class="text-on-surface-variant text-xs">…</span>';
        }
    }
    html += `<button class="px-4 py-2 text-xs font-semibold uppercase tracking-widest border border-outline-variant bg-surface hover:bg-surface-container-high transition-soft ${currentPage === totalPages ? 'opacity-40 pointer-events-none' : ''}" onclick="changePage(${currentPage + 1})">Siguiente →</button>`;
    html += '</div>';
    container.innerHTML = html;
}

function filterAll(val) {
    const query = val.toLowerCase();
    if(query.length > 2) {
        showPage('electro');
        const searchEl = document.getElementById('electroSearch');
        if(searchEl) searchEl.value = val;
        applyFilters(true);
    }
}

function addToCart(id) {
    const p = products.find(x => x.id === id);
    if(!p) return;
    const exists = cart.find(x => x.id === id);
    if(exists) {
        exists.quantity++;
        showToast(`✓ ${p.name} — otra unidad agregada`);
    } else {
        cart.push({...p, quantity: 1});
        showToast(`✓ ${p.name} agregado al carrito`);
    }
    saveCart();
    renderCart();
}

function showToast(msg) {
    const el = document.getElementById('cartToast');
    if (!el) return;
    el.querySelector('.toast-msg').textContent = msg;
    el.classList.remove('opacity-0', 'translate-y-4');
    el.classList.add('opacity-100', 'translate-y-0');
    clearTimeout(el._hide);
    clearTimeout(el._remove);
    el._hide = setTimeout(() => {
        el.classList.remove('opacity-100', 'translate-y-0');
        el.classList.add('opacity-0', 'translate-y-4');
    }, 3000);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    const el = document.getElementById('cartCount');
    if(el) el.innerText = count;
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    if(!container) return;
    if(cart.length === 0) {
        container.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-on-surface-variant opacity-50">
            <span class="material-symbols-outlined text-6xl mb-4">shopping_bag</span>
            <p class="font-display italic">Su bolsa está vacía actualmente</p>
        </div>`;
        if(totalEl) totalEl.innerText = '$0';
        return;
    }
    container.innerHTML = cart.map(item => `
        <div class="flex gap-4 group border-b border-outline-variant/40 pb-5 last:border-0">
            <div class="w-24 h-24 bg-surface-container-low flex-none overflow-hidden rounded-sm">
                <img src="${item.image}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 96 96%22><rect fill=%22%23e3e2e0%22 width=%2296%22 height=%2296%22/><text x=%2248%22 y=%2254%22 text-anchor=%22middle%22 font-size=%2232%22>📦</text></svg>'" class="w-full h-full object-cover">
            </div>
            <div class="flex-grow min-w-0">
                <div class="flex justify-between items-start gap-2">
                    <h4 class="font-display text-sm font-bold uppercase tracking-wider truncate">${item.name}</h4>
                    <button onclick="removeFromCart(${item.id})" class="text-on-surface-variant/40 hover:text-error transition-colors shrink-0">
                        <span class="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
                <p class="text-xs text-on-surface-variant/70 mt-0.5 mb-3">${formatCOP(item.price)} c/u</p>
                <div class="flex items-center justify-between">
                    <div class="flex border border-outline-variant text-xs">
                        <button onclick="changeQty(${item.id}, -1)" class="px-2.5 py-1.5 hover:bg-surface-container transition-colors leading-none">−</button>
                        <span class="px-3 py-1.5 border-x border-outline-variant font-bold min-w-[2rem] text-center">${item.quantity}</span>
                        <button onclick="changeQty(${item.id}, 1)" class="px-2.5 py-1.5 hover:bg-surface-container transition-colors leading-none">+</button>
                    </div>
                    <span class="text-sm font-bold font-display">${formatCOP(item.price * item.quantity)}</span>
                </div>
            </div>
        </div>
    `).join('');
    const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    if(totalEl) totalEl.innerText = formatCOP(total);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

function changeQty(id, delta) {
    const item = cart.find(x => x.id === id);
    if(item) {
        item.quantity += delta;
        if(item.quantity <= 0) removeFromCart(id);
        else {
            saveCart();
            renderCart();
        }
    }
}

function openCart() {
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');
    if(overlay) overlay.classList.remove('hidden');
    if(sidebar) sidebar.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');
    if(overlay) overlay.classList.add('hidden');
    if(sidebar) sidebar.classList.add('translate-x-full');
    document.body.style.overflow = '';
}

function openProductModal(id) {
    const p = products.find(x => x.id === id);
    if(!p) return;
    const discount = getDiscount(p);
    const priceHTML = p.originalPrice
        ? `<span class="original-price">${formatCOP(p.originalPrice)}</span> ${formatCOP(p.price)}`
        : formatCOP(p.price);
    const body = document.getElementById('modalBody');
    if(!body) return;
    const materialText = p.material === 'aluminio' ? 'aluminio aeronáutico' : p.material === 'metal' ? 'acero cepillado' : 'materiales sustentables';
    const descText = p.description || `Este artefacto ha sido seleccionado por su excepcional manufactura y estética superior. Construido con ${materialText}, garantiza durabilidad y una experiencia de usuario inigualable.`;

    const allImages = [p.image, ...(Array.isArray(p.images) ? p.images : [])];
    const hasGallery = allImages.length > 1;
    const mainId = 'modalMainImage';
    const thumbnails = hasGallery ? `
        <div class="flex gap-2 px-4 pb-4 overflow-x-auto">
            ${allImages.map((url, i) =>
                `<img src="${url}" class="thumb w-16 h-16 object-cover border-2 cursor-pointer transition-opacity hover:opacity-80 ${i === 0 ? 'border-primary' : 'border-transparent'}" onclick="document.getElementById('${mainId}').src='${url}'; document.querySelectorAll('#modalBody .thumb').forEach(t=>t.classList.remove('border-primary')); this.classList.add('border-primary')">`
            ).join('')}
        </div>` : '';

    body.innerHTML = `
        <div class="md:w-1/2 bg-surface-container-low flex flex-col">
            <img id="${mainId}" src="${p.image}" class="w-full h-80 md:h-[450px] object-cover flex-none">
            ${thumbnails}
        </div>
        <div class="md:w-1/2 p-12 flex flex-col justify-center">
            <span class="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">${Array.isArray(p.categories) ? p.categories.join(', ') : (p.category || '')} | ${p.tag}</span>
            <h2 class="text-4xl font-display font-bold mb-4 text-on-surface">${p.name}</h2>
            <p class="text-2xl font-price text-primary mb-8 font-semibold">${priceHTML}</p>
            <p class="text-on-surface-variant text-sm leading-relaxed mb-10">${descText}</p>
            <button onclick="addToCart(${p.id}); closeProductModal();" class="w-full bg-on-surface text-surface py-5 font-semibold uppercase tracking-widest hover:bg-primary transition-soft">
                Adquirir ahora
            </button>
            <p class="text-[10px] text-center mt-6 text-on-surface-variant uppercase tracking-widest">Disponibilidad limitada en boutique</p>
        </div>
    `;
    const modal = document.getElementById('productModal');
    if(modal) modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if(modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function openWhatsApp() {
    window.open('https://wa.me/573017085272?text=¡Hola! Quiero conocer más sobre sus productos premium.', '_blank');
}

function scrollCarousel(id, dir) {
    const el = document.getElementById(id);
    if(!el) return;
    const scrollAmount = 350;
    el.scrollBy({ left: scrollAmount * dir, behavior: 'smooth' });
}

function closeMenu() {
    const nav = document.getElementById('mobileNav');
    const overlay = document.getElementById('menuOverlay');
    if(nav) nav.classList.add('translate-x-full');
    if(overlay) overlay.classList.add('hidden');
    document.body.style.overflow = '';
}

function exploreRoom(room) {
    showPage('electro');
    setTimeout(() => {
        const allCheckboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"]');
        allCheckboxes.forEach(cb => cb.checked = false);
        const estanciaCb = document.querySelector(`.filter-sidebar input[type="checkbox"][value="${room}"]`);
        if (estanciaCb) estanciaCb.checked = true;
        applyFilters();
    }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cartIcon');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const hamburger = document.getElementById('hamburger');
    const menuOverlay = document.getElementById('menuOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if(cartIcon) cartIcon.onclick = openCart;
    if(cartClose) cartClose.onclick = closeCart;
    if(cartOverlay) cartOverlay.onclick = closeCart;

    if(hamburger) hamburger.onclick = () => {
        const nav = document.getElementById('mobileNav');
        const overlay = document.getElementById('menuOverlay');
        if(nav) nav.classList.remove('translate-x-full');
        if(overlay) overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };
    if(menuOverlay) menuOverlay.onclick = closeMenu;
    if(checkoutBtn) checkoutBtn.onclick = () => {
        if(cart.length === 0) {
            showToast('Tu carrito está vacío');
            return;
        }
        closeCart();
        openCheckout();
    };

    renderProducts();
    renderCart();
    // Handle initial hash for browser navigation
    const initHash = window.location.hash.replace('#', '');
    if (initHash === 'catalogo' || initHash === 'electro') {
        showPage('electro');
    }
    checkAdminAccess();
});

/* ===== ADMIN PANEL ===== */
let adminAuth = false;
let authUnsub = null;

function checkAdminAccess() {
    if (window.location.hash !== '#admin') return;
    if (adminAuth) {
        openAdmin();
    } else {
        showAdminLogin();
    }
}

function showAdminLogin() {
    showPage('admin');
    const box = document.getElementById('adminLoginBox');
    if (!box) return;
    box.innerHTML = `
<div class="bg-surface-container-lowest border border-outline-variant p-8 mb-6">
<h3 class="font-display text-xl mb-4">Iniciar Sesión como Administrador</h3>
<p class="text-on-surface-variant text-sm mb-6">Usá tu cuenta de administrador para acceder al panel.</p>
<div class="flex flex-col md:flex-row gap-4 max-w-lg">
<input class="flex-1 border border-outline-variant bg-surface px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none" id="adminLoginEmail" placeholder="Correo electrónico" type="email"/>
<input class="flex-1 border border-outline-variant bg-surface px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none" id="adminLoginPass" placeholder="Contraseña" type="password"/>
<button class="bg-on-surface text-surface px-6 py-2.5 text-sm font-semibold uppercase tracking-widest hover:bg-primary transition-soft" id="adminLoginBtn" type="button">Ingresar</button>
</div>
<p class="text-error text-sm mt-3 hidden" id="adminLoginError"></p>
</div>`;
    document.getElementById('adminLoginError')?.classList.add('hidden');
    setupAdminLogin();
    document.getElementById('adminPanelContent')?.style.setProperty('display', 'none');
    const formContainer = document.getElementById('adminForm')?.closest('.bg-surface-container-lowest');
    if (formContainer && formContainer !== box.closest('.bg-surface-container-lowest')) {
        formContainer.classList.add('hidden');
    }
    const tableContainer = document.querySelector('#page-admin .overflow-hidden');
    if (tableContainer) tableContainer.classList.add('hidden');
}

function setupAdminLogin() {
    const loginBtn = document.getElementById('adminLoginBtn');
    if (!loginBtn) return;
    loginBtn.onclick = async () => {
        const email = document.getElementById('adminLoginEmail')?.value.trim();
        const pass = document.getElementById('adminLoginPass')?.value;
        const errEl = document.getElementById('adminLoginError');
        if (!email || !pass) {
            if (errEl) { errEl.textContent = 'Completá ambos campos.'; errEl.classList.remove('hidden'); }
            return;
        }
        try {
            await firebase.auth(firebaseApp).signInWithEmailAndPassword(email, pass);
            if (errEl) errEl.classList.add('hidden');
        } catch (e) {
            const msg = e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential'
                ? 'Credenciales inválidas.'
                : e.code === 'auth/too-many-requests'
                ? 'Demasiados intentos. Esperá un momento.'
                : 'Error al iniciar sesión.';
            if (errEl) { errEl.textContent = msg; errEl.classList.remove('hidden'); }
        }
    };
    document.getElementById('adminLoginPass')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') loginBtn.click();
    });
    document.getElementById('adminLoginEmail')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') loginBtn.click();
    });
}

function adminLogout() {
    firebase.auth(firebaseApp).signOut().then(() => {
        adminAuth = false;
        showAdminLogin();
        showPage('home');
    });
}

function openAdmin() {
    adminAuth = true;
    const box = document.getElementById('adminLoginBox');
    if (box) box.innerHTML = '';
    document.getElementById('adminPanelContent')?.style.setProperty('display', 'block');
    const formContainer = document.getElementById('adminForm')?.closest('.bg-surface-container-lowest');
    if (formContainer) formContainer.classList.remove('hidden');
    const tableContainer = document.querySelector('#page-admin .overflow-hidden');
    if (tableContainer) tableContainer.classList.remove('hidden');
    showPage('admin');
    adminRenderTable();
    document.getElementById('adminForm').reset();
    document.getElementById('adminEditId').value = '';
    const btn = document.getElementById('adminSaveBtn');
    if (btn) {
        btn.onclick = function() { adminSaveProduct(); };
    }
}

function closeAdmin() {
    history.pushState({ page: 'home' }, '', window.location.pathname);
    showPage('home');
}

async function adminSaveProduct() {
    try {
        const editId = document.getElementById('adminEditId').value;
        const name = document.getElementById('adminName').value.trim();
        const price = parseInt(document.getElementById('adminPrice').value);
        const originalPrice = parseInt(document.getElementById('adminOriginalPrice').value) || undefined;
        const stock = parseInt(document.getElementById('adminStock').value) || 0;
        const categories = Array.from(document.querySelectorAll('#adminCategories input[type="checkbox"]:checked')).map(cb => cb.value);
        const tag = document.getElementById('adminTag').value;
        const description = document.getElementById('adminDescription').value.trim();
        const fileInput = document.getElementById('adminImageFile');
        const preview = document.getElementById('adminImagePreview');
        let image = document.getElementById('adminImage').value.trim();

        const estancias = Array.from(document.querySelectorAll('#adminEstancias input[type="checkbox"]:checked')).map(cb => cb.value);

        const uploadStatus = document.getElementById('adminUploadStatus');
        if (fileInput.files.length > 0 && (!preview.src || preview.classList.contains('hidden'))) {
            alert('Esperá a que termine la subida de la imagen a Cloudinary.');
            return;
        }

        if (fileInput.files.length > 0) {
            if (preview.src && !preview.classList.contains('hidden')) {
                image = preview.src;
            }
        } else if (!image && preview.src && !preview.classList.contains('hidden')) {
            image = preview.src;
        }

        if (!name || !price || !image) {
            alert('Completa todos los campos: nombre, precio e imagen (URL o archivo).');
            return;
        }

        if (categories.length === 0) {
            alert('Seleccioná al menos una categoría para el producto.');
            return;
        }

        if (estancias.length === 0) {
            alert('Seleccioná al menos una estancia donde se mostrará el producto.');
            return;
        }

        const product = { id: 0, name, price, categories, tag, image, description, estancias, stock };
        if (extraImages.length > 0) product.images = extraImages;
        if (originalPrice) product.originalPrice = originalPrice;

        if (editId) {
            product.id = parseInt(editId);
            const idx = products.findIndex(p => p.id === product.id);
            if (idx !== -1) {
                products[idx] = { ...products[idx], ...product };
                if (firebaseReady) await firebaseSaveProductToCloud(products[idx]);
            }
        } else {
            product.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push(product);
            if (firebaseReady) await firebaseSaveProductToCloud(product);
        }

        adminCancelEdit();
        adminRenderTable();
        refreshSiteProducts();
        alert('Producto guardado correctamente.');
    } catch (err) {
        alert('Error inesperado: ' + err.message + ' (revisá la consola con F12)');
        throw err;
    }
}

function adminCancelEdit() {
    document.getElementById('adminForm').reset();
    document.getElementById('adminEditId').value = '';
    document.querySelectorAll('#adminEstancias input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('#adminCategories input[type="checkbox"]').forEach(cb => cb.checked = false);
    const preview = document.getElementById('adminImagePreview');
    preview.classList.add('hidden');
    preview.src = '';
    const status = document.getElementById('adminUploadStatus');
    status.textContent = '';
    extraImages = [];
    renderExtraImages();
}

function adminUploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const status = document.getElementById('adminUploadStatus');
    const preview = document.getElementById('adminImagePreview');
    const urlInput = document.getElementById('adminImage');
    status.textContent = 'Subiendo...';
    status.className = 'text-xs text-on-surface-variant mt-2';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`, {
        method: 'POST',
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error('Error al subir a Cloudinary (HTTP ' + res.status + ')');
        return res.json();
    })
    .then(data => {
        const url = data.secure_url;
        preview.src = url;
        preview.classList.remove('hidden');
        urlInput.value = url;
        status.textContent = '✓ Imagen subida a Cloudinary';
        status.className = 'text-xs text-green-700 mt-2';
        e.target.value = '';
    })
    .catch(err => {
        console.error('Cloudinary upload error:', err);
        status.textContent = '✗ Error: ' + err.message;
        status.className = 'text-xs text-red-600 mt-2';
        e.target.value = '';
    });
}

/* ===== IMÁGENES ADICIONALES ===== */
let extraImages = [];

function adminUploadExtraImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`, { method: 'POST', body: formData })
    .then(res => { if (!res.ok) throw new Error('Error al subir (HTTP ' + res.status + ')'); return res.json(); })
    .then(data => {
        extraImages.push(data.secure_url);
        renderExtraImages();
        e.target.value = '';
    })
    .catch(err => { alert('Error: ' + err.message); e.target.value = ''; });
}

function adminRemoveExtraImage(index) {
    extraImages.splice(index, 1);
    renderExtraImages();
}

function renderExtraImages() {
    const container = document.getElementById('adminExtraImages');
    if (!container) return;
    container.innerHTML = extraImages.map((url, i) =>
        `<div class="relative group">
            <img src="${url}" class="w-20 h-20 object-cover border border-outline-variant">
            <button class="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onclick="adminRemoveExtraImage(${i})">✕</button>
        </div>`
    ).join('');
}

function adminEditProduct(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    document.getElementById('adminEditId').value = p.id;
    document.getElementById('adminName').value = p.name;
    document.getElementById('adminPrice').value = p.price;
    document.getElementById('adminOriginalPrice').value = p.originalPrice || '';
    document.getElementById('adminStock').value = p.stock || 0;
    document.getElementById('adminTag').value = p.tag;
    document.getElementById('adminDescription').value = p.description || '';
    document.getElementById('adminImage').value = '';
    const preview = document.getElementById('adminImagePreview');
    preview.src = p.image;
    preview.classList.remove('hidden');
    const status = document.getElementById('adminUploadStatus');
    status.textContent = '';
    extraImages = Array.isArray(p.images) ? [...p.images] : [];
    renderExtraImages();
    // Check categories
    const cats = Array.isArray(p.categories) ? p.categories : (p.category ? [p.category] : []);
    document.querySelectorAll('#adminCategories input[type="checkbox"]').forEach(cb => {
        cb.checked = cats.includes(cb.value);
    });
    // Check estancias
    document.querySelectorAll('#adminEstancias input[type="checkbox"]').forEach(cb => {
        cb.checked = p.estancias ? p.estancias.includes(cb.value) : false;
    });
    window.scrollTo({ top: document.getElementById('adminForm').offsetTop - 120, behavior: 'smooth' });
}

function adminRenderTable() {
    const tbody = document.getElementById('adminTableBody');
    if (!tbody) return;
    const searchInput = document.getElementById('adminSearch');
    const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const filtered = term ? products.filter(p => p.name.toLowerCase().includes(term)) : products;
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td class="px-4 py-8 text-center text-on-surface-variant" colspan="8">' + (term ? 'No se encontraron productos con ese nombre.' : 'No hay productos todavía.') + '</td></tr>';
        return;
    }
    tbody.innerHTML = filtered.map(p => `
        <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
            <td class="px-4 py-3 text-on-surface-variant text-xs">${p.id}</td>
            <td class="px-4 py-3"><img src="${p.image}" class="w-12 h-12 object-cover border border-outline-variant"/></td>
            <td class="px-4 py-3 font-medium">${p.name}</td>
            <td class="px-4 py-3">${formatCOP(p.price)}${p.originalPrice ? ' <span class="text-on-surface-variant/50 line-through text-xs">' + formatCOP(p.originalPrice) + '</span>' : ''}</td>
            <td class="px-4 py-3 text-xs uppercase tracking-wider text-on-surface-variant">${(Array.isArray(p.categories) ? p.categories : [p.category || '']).join(', ')}</td>
            <td class="px-4 py-3 text-xs">${p.stock !== undefined ? p.stock : '-'}</td>
            <td class="px-4 py-3"><span class="text-[10px] px-2 py-0.5 font-bold uppercase text-white ${p.tag === 'Nuevo' ? 'bg-green-700' : p.tag === 'Oferta' ? 'bg-orange-700' : 'bg-amber-800'}">${p.tag}</span></td>
            <td class="px-4 py-3 text-right">
                <button onclick="adminEditProduct(${p.id})" class="text-primary hover:text-on-primary-fixed-variant transition-colors text-sm font-semibold uppercase tracking-wider mr-3">Editar</button>
                <button onclick="adminDeleteProduct(${p.id})" class="text-error hover:text-on-error-container transition-colors text-sm font-semibold uppercase tracking-wider">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function refreshSiteProducts() {
    renderProducts();
    renderCart();
    applyFilters();
}

function adminExportJSON() {
    const data = JSON.stringify(products, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'productos.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function adminReassignIds() {
    if (!firestoreDb) {
        alert('Firebase no está conectado.');
        return;
    }
    if (!confirm('¿Reasignar IDs a todos los productos secuencialmente desde 1? Esta operación es irreversible.')) return;
    try {
        const snapshot = await firestoreDb.collection('productos').orderBy('id', 'asc').get();
        if (snapshot.empty) {
            alert('No hay productos en Firebase.');
            return;
        }
        const docs = [];
        snapshot.forEach(doc => docs.push({ id: doc.id, data: doc.data() }));
        for (let i = 0; i < docs.length; i++) {
            const newId = i + 1;
            docs[i].data.id = newId;
            await firestoreDb.collection('productos').doc(String(newId)).set(docs[i].data);
            if (String(newId) !== docs[i].id) {
                await firestoreDb.collection('productos').doc(docs[i].id).delete();
            }
        }
        await firebaseLoadProducts();
        alert('IDs reasignados correctamente.');
    } catch (e) {
        alert('Error al reasignar IDs: ' + e.message);
        console.error(e);
    }
}

/* ===== FIREBASE INTEGRATION ===== */
let firebaseApp = null;
let firestoreDb = null;
let firebaseReady = false;

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCWDbLxZ15J6f50Gfu4tGFWHZ6wZ1qWNdI",
    projectId: "database-multitech",
    storageBucket: "database-multitech.firebasestorage.app",
    appId: "1:196014084589:web:9d6b64ff928df9b67357e4",
    messagingSenderId: "196014084589"
};

function firebaseInit() {
    try {
        firebaseApp = firebase.initializeApp(FIREBASE_CONFIG, 'multitechco');
        firestoreDb = firebaseApp.firestore();
        firebaseReady = true;
        updateFirebaseStatus();
        firebaseLoadProducts();
        // Listen for auth state changes
        firebase.auth(firebaseApp).onAuthStateChanged(user => {
            if (user && user.email === 'admin@multitechcolombia.com') {
                adminAuth = true;
                if (window.location.hash === '#admin') {
                    openAdmin();
                }
            } else {
                adminAuth = false;
                if (window.location.hash === '#admin') {
                    showAdminLogin();
                }
            }
        });
    } catch (e) {
        console.error('Firebase init error:', e);
        alert('Error al conectar con Firebase: ' + e.message);
    }
}

function updateFirebaseStatus() {
    const el = document.getElementById('firebaseStatus');
    if (!el) return;
    el.innerHTML = '<span class="text-green-700 font-semibold">✓ Conectado a Firebase.</span> Los productos se guardan en la nube.';
}

async function firebaseLoadProducts() {
    if (!firestoreDb) return;
    try {
        const snapshot = await firestoreDb.collection('productos').orderBy('id', 'asc').get();
        if (!snapshot.empty) {
            const fbProducts = [];
            snapshot.forEach(doc => fbProducts.push(doc.data()));
            products.length = 0;
            fbProducts.forEach(p => products.push(p));
            refreshSiteProducts();
            adminRenderTable();
        }
    } catch (e) {
        alert('Error al cargar productos de Firebase: ' + e.message);
        console.error('Error loading from Firestore:', e);
    }
}

async function firebaseSaveProductToCloud(product) {
    if (!firestoreDb) return;
    try {
        await firestoreDb.collection('productos').doc(String(product.id)).set(product);
    } catch (e) {
        alert('Error al guardar en Firebase: ' + e.message);
        console.error('Error saving to Firestore:', e);
    }
}

async function firebaseDeleteProductFromCloud(id) {
    if (!firestoreDb) return;
    try {
        await firestoreDb.collection('productos').doc(String(id)).delete();
    } catch (e) {
        console.error('Error deleting from Firestore:', e);
    }
}

async function adminDeleteProduct(id) {
    if (!confirm('¿Eliminar este producto permanentemente?')) return;
    products = products.filter(p => p.id !== id);
    if (firebaseReady) await firebaseDeleteProductFromCloud(id);
    adminRenderTable();
    refreshSiteProducts();
}

// Init Firebase on page load
firebaseInit();

/* ===== CHECKOUT ===== */

function openCheckout() {
    const modal = document.getElementById('checkoutModal');
    if (!modal) return;
    // Clear form
    ['checkoutName','checkoutEmail','checkoutPhone','checkoutCity','checkoutAddress'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    // Reset terms checkbox
    const termsCb = document.getElementById('termsCheckbox');
    if (termsCb) {
        termsCb.checked = false;
        document.getElementById('checkoutPayBtn').disabled = true;
    }
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.getElementById('checkoutStep1').classList.remove('hidden');
    document.getElementById('checkoutStep2').classList.add('hidden');
    document.getElementById('checkoutLoading').classList.add('hidden');
    document.getElementById('checkoutSuccess').classList.add('hidden');
    document.getElementById('checkoutError').classList.add('hidden');
    document.getElementById('checkoutPayBtn').disabled = false;
    // Focus first field
    setTimeout(() => document.getElementById('checkoutName')?.focus(), 100);
}

function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
}

window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;

document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.id === 'checkoutPayBtn') {
        proceedToPayment();
    }
    if (target.classList.contains('checkout-continue') || target.closest('.checkout-continue')) {
        goToStep2();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !document.getElementById('checkoutStep1')?.classList.contains('hidden')) {
        const active = document.activeElement;
        if (active && active.closest('#checkoutStep1')) {
            goToStep2();
        }
    }
});

function goToStep2() {
    const name = document.getElementById('checkoutName').value.trim();
    const email = document.getElementById('checkoutEmail').value.trim();
    const phone = document.getElementById('checkoutPhone').value.trim();
    const city = document.getElementById('checkoutCity').value.trim();
    const address = document.getElementById('checkoutAddress').value.trim();

    if (!name) return showToast('Ingresá tu nombre');
    if (!email || !email.includes('@')) return showToast('Ingresá un correo válido');
    if (!phone) return showToast('Ingresá tu teléfono');

    document.getElementById('checkoutStep1').classList.add('hidden');
    document.getElementById('checkoutStep2').classList.remove('hidden');

    // Render order summary
    const container = document.getElementById('checkoutItems');
    container.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center text-sm">
            <span><span class="font-semibold">${item.quantity}x</span> ${item.name}</span>
            <span>${formatCOP(item.price * item.quantity)}</span>
        </div>
    `).join('');

    const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const shipping = subtotal >= 500000 ? 0 : 15000;
    const total = subtotal + shipping;

    document.getElementById('checkoutSubtotal').textContent = formatCOP(subtotal);
    document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'Gratis' : formatCOP(shipping);
    document.getElementById('checkoutTotal').textContent = formatCOP(total);
}

function openTermsModal() {
    document.getElementById('termsModal')?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeTermsModal() {
    document.getElementById('termsModal')?.classList.add('hidden');
    document.body.style.overflow = '';
}

window.openTermsModal = openTermsModal;
window.closeTermsModal = closeTermsModal;

// Enable pay button only when terms are accepted
document.addEventListener('change', (e) => {
    if (e.target.id === 'termsCheckbox') {
        document.getElementById('checkoutPayBtn').disabled = !e.target.checked;
    }
});

async function proceedToPayment() {
    const payBtn = document.getElementById('checkoutPayBtn');
    const loading = document.getElementById('checkoutLoading');
    const step2 = document.getElementById('checkoutStep2');

    const name = document.getElementById('checkoutName').value.trim();
    const email = document.getElementById('checkoutEmail').value.trim();
    const phone = document.getElementById('checkoutPhone').value.trim();

    step2.classList.add('hidden');
    loading.classList.remove('hidden');
    payBtn.disabled = true;

    try {
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: cart,
                customer: { name, email, phone }
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Error al conectar con el procesador de pagos');
        }

        // Redirect to MercadoPago
        loading.classList.add('hidden');
        window.location.href = data.init_point;
    } catch (err) {
        loading.classList.add('hidden');
        step2.classList.remove('hidden');
        payBtn.disabled = false;
        document.getElementById('checkoutErrorMsg').textContent = err.message;
        document.getElementById('checkoutError').classList.remove('hidden');
    }
}

/* ===== HANDLE PAYMENT RETURN ===== */
(function checkPaymentReturn() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('payment');
    const collectionId = params.get('collection_id');
    if (status === 'success') {
        cart.length = 0;
        saveCart();
        renderCart();
        setTimeout(() => {
            openCheckout();
            document.getElementById('checkoutStep1').classList.add('hidden');
            document.getElementById('checkoutStep2').classList.add('hidden');
            document.getElementById('checkoutLoading').classList.add('hidden');
            document.getElementById('checkoutError').classList.add('hidden');
            document.getElementById('checkoutSuccess').classList.remove('hidden');
            if (collectionId) document.getElementById('checkoutPaymentId').textContent = 'ID de transacción: ' + collectionId;
        }, 500);
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
    } else if (status === 'failure') {
        setTimeout(() => {
            openCheckout();
            document.getElementById('checkoutStep1').classList.add('hidden');
            document.getElementById('checkoutStep2').classList.add('hidden');
            document.getElementById('checkoutLoading').classList.add('hidden');
            document.getElementById('checkoutSuccess').classList.add('hidden');
            document.getElementById('checkoutError').classList.remove('hidden');
            document.getElementById('checkoutErrorMsg').textContent = 'El pago no pudo completarse. Intentá de nuevo.';
        }, 500);
        window.history.replaceState({}, '', window.location.pathname);
    } else if (status === 'pending') {
        showToast('Tu pago está pendiente de confirmación');
        window.history.replaceState({}, '', window.location.pathname);
    }
})();

/* ===== COOKIE CONSENT ===== */
(function() {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;
    if (localStorage.getItem('cookies_accepted') !== null) return;
    setTimeout(() => banner.classList.add('show'), 600);
})();

function acceptCookies() {
    localStorage.setItem('cookies_accepted', 'true');
    const banner = document.getElementById('cookieBanner');
    banner.classList.remove('show');
    banner.classList.add('hide');
}

function declineCookies() {
    localStorage.setItem('cookies_accepted', 'false');
    const banner = document.getElementById('cookieBanner');
    banner.classList.remove('show');
    banner.classList.add('hide');
}
