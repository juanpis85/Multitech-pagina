let products = [
    { id: 1, name: "Nevera Side-by-Side Smart", price: 1850000, category: "electrodomesticos", image: "https://images.unsplash.com/photo-1571175432270-4822567450d9?w=800&q=80", tag: "Nuevo", material: "metal", originalPrice: 2100000 },
    { id: 2, name: "MacBook Pro M3 Max", price: 8950000, category: "tecno", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", tag: "Oferta", material: "aluminio", originalPrice: 9990000 },
    { id: 3, name: "AirPods Max Silver", price: 1250000, category: "tecno", image: "https://images.unsplash.com/photo-1613040819284-97f741502c2c?w=800&q=80", tag: "Mas Vendido", material: "aluminio" },
    { id: 4, name: "Horno Empotrable Pro", price: 980000, category: "electrodomesticos", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80", tag: "Nuevo", material: "metal" },
    { id: 5, name: "Teclado Mecánico Custom", price: 245000, category: "accesorios", image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80", tag: "Oferta", material: "aluminio", originalPrice: 299000 },
    { id: 6, name: "Mouse Inalámbrico Zen", price: 132000, category: "accesorios", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80", tag: "Mas Vendido", material: "plastico" },
    { id: 7, name: "Lavadora Ultra Quiet", price: 2200000, category: "electrodomesticos", image: "https://images.unsplash.com/photo-1582730147043-34827495fe45?w=800&q=80", tag: "Nuevo", material: "metal" },
    { id: 8, name: "Monitor 4K Design Studio", price: 1680000, category: "tecno", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80", tag: "Oferta", material: "aluminio", originalPrice: 1990000 },
    { id: 9, name: "Cafetera Expreso Italia", price: 420000, category: "electrodomesticos", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80", tag: "Nuevo", material: "metal" },
    { id: 10, name: "Auriculares Inalámbricos Pro", price: 189000, category: "tecno", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", tag: "Mas Vendido", material: "plastico" },
    { id: 11, name: "Freidora de Aire Digital", price: 289000, category: "electrodomesticos", image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80", tag: "Oferta", material: "metal", originalPrice: 349000 },
    { id: 12, name: "Base de Carga Inalámbrica", price: 89000, category: "accesorios", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80", tag: "Nuevo", material: "plastico" },
    { id: 13, name: "Smartwatch Deportivo", price: 349000, category: "tecno", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", tag: "Nuevo", material: "aluminio" },
    { id: 14, name: "Aspiradora Robot Inteligente", price: 890000, category: "electrodomesticos", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80", tag: "Mas Vendido", material: "plastico" },
    { id: 15, name: "Hub USB-C 7 en 1", price: 65000, category: "accesorios", image: "https://images.unsplash.com/photo-1619953942547-233eab5a70d6?w=800&q=80", tag: "Oferta", material: "aluminio", originalPrice: 85000 }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function formatCOP(price) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
}

function getDiscount(p) {
    return p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
}

function createProductCard(p) {
    const div = document.createElement('div');
    div.className = "product-card flex-none w-72 md:w-80 group snap-start bg-white overflow-hidden";
    const discount = getDiscount(p);
    const priceHTML = p.originalPrice
        ? `<span class="original-price">${formatCOP(p.originalPrice)}</span> ${formatCOP(p.price)}`
        : formatCOP(p.price);
    const discountBadge = discount > 0 ? `<span class="product-badge discount">-${discount}%</span>` : "";
    div.innerHTML = `
        <div class="relative overflow-hidden aspect-[4/5] bg-surface-container-low">
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
        <div class="p-6 text-center">
            <p class="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1 font-semibold">${p.category}</p>
            <h4 class="font-display text-lg mb-2 text-on-surface group-hover:text-primary transition-colors cursor-pointer" onclick="openProductModal(${p.id})">${p.name}</h4>
            <p class="text-primary font-price text-lg font-semibold">${priceHTML}</p>
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
        const card = createProductCard(p);
        if(p.tag === 'Nuevo' && grids.nuevos) grids.nuevos.appendChild(card.cloneNode(true));
        if(p.tag === 'Oferta' && grids.ofertas) grids.ofertas.appendChild(card.cloneNode(true));
        if(p.tag === 'Mas Vendido' && grids.vendidos) grids.vendidos.appendChild(card.cloneNode(true));
        if(grids.electro) grids.electro.appendChild(card.cloneNode(true));
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
}

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
    cocina: ['electrodomesticos'],
    sala: ['electrodomesticos', 'accesorios'],
    oficina: ['tecno', 'accesorios'],
    dormitorio: ['electrodomesticos', 'accesorios'],
    bano: ['accesorios']
};

function applyFilters() {
    const query = document.getElementById('electroSearch')?.value?.toLowerCase() || '';
    const checkedEstancias = Array.from(document.querySelectorAll('.filter-sidebar input[type="checkbox"][value="cocina"], .filter-sidebar input[type="checkbox"][value="sala"], .filter-sidebar input[type="checkbox"][value="oficina"], .filter-sidebar input[type="checkbox"][value="dormitorio"], .filter-sidebar input[type="checkbox"][value="bano"]')).filter(cb => cb.checked).map(cb => cb.value);
    const checkedTypes = Array.from(document.querySelectorAll('.filter-sidebar input[type="checkbox"][value="tecno"], .filter-sidebar input[type="checkbox"][value="electrodomesticos"], .filter-sidebar input[type="checkbox"][value="accesorios"]')).filter(cb => cb.checked).map(cb => cb.value);
    const priceRange = document.querySelector('input[name="price"]:checked')?.value;
    const grid = document.getElementById('electroGrid');
    if(!grid) return;

    const allowedCategories = new Set();
    checkedEstancias.forEach(e => estanciaCategories[e].forEach(c => allowedCategories.add(c)));
    checkedTypes.forEach(t => allowedCategories.add(t));

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(query);
        const matchCat = allowedCategories.size === 0 || allowedCategories.has(p.category);
        let matchPrice = true;
        if(priceRange && priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            matchPrice = p.price >= min && p.price <= max;
        }
        return matchSearch && matchCat && matchPrice;
    });
    grid.innerHTML = '';
    filtered.forEach(p => grid.appendChild(createProductCard(p)));
    const countEl = document.getElementById('productCount');
    if(countEl) countEl.innerText = filtered.length;
}

function filterAll(val) {
    const query = val.toLowerCase();
    if(query.length > 2) {
        showPage('electro');
        const searchEl = document.getElementById('electroSearch');
        if(searchEl) searchEl.value = val;
        applyFilters();
    }
}

function addToCart(id) {
    const p = products.find(x => x.id === id);
    if(!p) return;
    const exists = cart.find(x => x.id === id);
    if(exists) exists.quantity++;
    else cart.push({...p, quantity: 1});
    saveCart();
    renderCart();
    openCart();
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
        <div class="flex gap-4 group">
            <div class="w-24 h-24 bg-surface-container-low flex-none overflow-hidden">
                <img src="${item.image}" class="w-full h-full object-cover">
            </div>
            <div class="flex-grow">
                <div class="flex justify-between items-start mb-1">
                    <h4 class="font-display text-sm font-bold uppercase tracking-wider">${item.name}</h4>
                    <button onclick="removeFromCart(${item.id})" class="text-on-surface-variant hover:text-error transition-colors">
                        <span class="material-symbols-outlined text-base">close</span>
                    </button>
                </div>
                <p class="text-xs text-on-surface-variant mb-4">${formatCOP(item.price)}</p>
                <div class="flex items-center gap-4">
                    <div class="flex border border-outline-variant text-[10px]">
                        <button onclick="changeQty(${item.id}, -1)" class="px-2 py-1 hover:bg-surface-container">-</button>
                        <span class="px-3 py-1 border-x border-outline-variant font-bold">${item.quantity}</span>
                        <button onclick="changeQty(${item.id}, 1)" class="px-2 py-1 hover:bg-surface-container">+</button>
                    </div>
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
    body.innerHTML = `
        <div class="md:w-1/2 bg-surface-container-low h-80 md:h-auto">
            <img src="${p.image}" class="w-full h-full object-cover">
        </div>
        <div class="md:w-1/2 p-12 flex flex-col justify-center">
            <span class="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">${p.category} | ${p.tag}</span>
            <h2 class="text-4xl font-display font-bold mb-4 text-on-surface">${p.name}</h2>
            <p class="text-2xl font-price text-primary mb-8 font-semibold">${priceHTML}</p>
            <p class="text-on-surface-variant text-sm leading-relaxed mb-10">Este artefacto ha sido seleccionado por su excepcional manufactura y estética superior. Construido con ${materialText}, garantiza durabilidad y una experiencia de usuario inigualable.</p>
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
    window.open('https://wa.me/573000000000?text=Hola, estoy interesado en sus productos premium.', '_blank');
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
            alert('Tu carrito está vacío');
            return;
        }
        const total = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
        const msg = encodeURIComponent('¡Hola! Quiero finalizar mi compra en MultiTechco por un total de ' + formatCOP(total));
        window.open('https://wa.me/573000000000?text=' + msg, '_blank');
        cart.length = 0;
        saveCart();
        renderCart();
        closeCart();
    };

    renderProducts();
    renderCart();
    checkAdminAccess();
});

/* ===== ADMIN PANEL ===== */
const ADMIN_PASSWORD = 'kjkrzpj8599';
let adminAuth = sessionStorage.getItem('admin_auth') === 'true';

function checkAdminAccess() {
    if (window.location.hash === '#admin') {
        if (!adminAuth) {
            promptAdminPassword();
        } else {
            setTimeout(openAdmin, 100);
        }
    }
}

function promptAdminPassword() {
    const pass = prompt('🔐 Ingrese la clave de administrador:');
    if (pass === ADMIN_PASSWORD) {
        adminAuth = true;
        sessionStorage.setItem('admin_auth', 'true');
        openAdmin();
    } else if (pass !== null) {
        alert('Clave incorrecta.');
        window.location.hash = '';
    }
}

function openAdmin() {
    adminAuth = true;
    sessionStorage.setItem('admin_auth', 'true');
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
    window.location.hash = '';
    showPage('home');
}

async function adminSaveProduct() {
    try {
        const editId = document.getElementById('adminEditId').value;
        const name = document.getElementById('adminName').value.trim();
        const price = parseInt(document.getElementById('adminPrice').value);
        const originalPrice = parseInt(document.getElementById('adminOriginalPrice').value) || undefined;
        const category = document.getElementById('adminCategory').value;
        const tag = document.getElementById('adminTag').value;
        const material = document.getElementById('adminMaterial').value;
        const fileInput = document.getElementById('adminImageFile');
        const preview = document.getElementById('adminImagePreview');
        let image = document.getElementById('adminImage').value.trim();

        if (fileInput.files.length > 0) {
            if (firebaseReady) {
                try {
                    image = await firebaseUploadImage(fileInput.files[0]);
                } catch (e) {
                    alert('Error al subir imagen: ' + e.message);
                    return;
                }
            } else {
                if (preview.src && !preview.classList.contains('hidden')) {
                    image = preview.src;
                }
            }
        } else if (!image && preview.src && !preview.classList.contains('hidden')) {
            image = preview.src;
        }

        if (!name || !price || !image) {
            alert('Completa todos los campos: nombre, precio e imagen (URL o archivo).');
            return;
        }

        if (editId) {
            const idx = products.findIndex(p => p.id === parseInt(editId));
            if (idx !== -1) {
                products[idx] = { ...products[idx], name, price, originalPrice, category, tag, material, image };
                if (firebaseReady) await firebaseSaveProductToCloud(products[idx]);
            }
        } else {
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            const newProduct = { id: newId, name, price, originalPrice, category, tag, material, image };
            products.push(newProduct);
            if (firebaseReady) await firebaseSaveProductToCloud(newProduct);
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
    const preview = document.getElementById('adminImagePreview');
    preview.classList.add('hidden');
    preview.src = '';
}

function adminUploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
        const preview = document.getElementById('adminImagePreview');
        preview.src = event.target.result;
        preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function adminEditProduct(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    document.getElementById('adminEditId').value = p.id;
    document.getElementById('adminName').value = p.name;
    document.getElementById('adminPrice').value = p.price;
    document.getElementById('adminOriginalPrice').value = p.originalPrice || '';
    document.getElementById('adminCategory').value = p.category;
    document.getElementById('adminTag').value = p.tag;
    document.getElementById('adminMaterial').value = p.material;
    document.getElementById('adminImage').value = '';
    const preview = document.getElementById('adminImagePreview');
    preview.src = p.image;
    preview.classList.remove('hidden');
    window.scrollTo({ top: document.getElementById('adminForm').offsetTop - 120, behavior: 'smooth' });
}

function adminDeleteProduct(id) {
    if (!confirm('¿Eliminar este producto permanentemente?')) return;
    products = products.filter(p => p.id !== id);
    adminRenderTable();
    refreshSiteProducts();
}

function adminRenderTable() {
    const tbody = document.getElementById('adminTableBody');
    if (!tbody) return;
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td class="px-4 py-8 text-center text-on-surface-variant" colspan="7">No hay productos todavía.</td></tr>';
        return;
    }
    tbody.innerHTML = products.map(p => `
        <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
            <td class="px-4 py-3 text-on-surface-variant text-xs">${p.id}</td>
            <td class="px-4 py-3"><img src="${p.image}" class="w-12 h-12 object-cover border border-outline-variant"/></td>
            <td class="px-4 py-3 font-medium">${p.name}</td>
            <td class="px-4 py-3">${formatCOP(p.price)}${p.originalPrice ? ' <span class="text-on-surface-variant/50 line-through text-xs">' + formatCOP(p.originalPrice) + '</span>' : ''}</td>
            <td class="px-4 py-3 text-xs uppercase tracking-wider text-on-surface-variant">${p.category}</td>
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

/* ===== FIREBASE INTEGRATION ===== */
let firebaseApp = null;
let firestoreDb = null;
let storageRef = null;
let firebaseReady = false;

function firebaseLoadConfig() {
    try {
        const saved = localStorage.getItem('firebase_config');
        if (saved) {
            const config = JSON.parse(saved);
            document.getElementById('fbApiKey').value = config.apiKey || '';
            document.getElementById('fbProjectId').value = config.projectId || '';
            document.getElementById('fbStorageBucket').value = config.storageBucket || '';
            document.getElementById('fbAppId').value = config.appId || '';
            document.getElementById('fbMessagingSenderId').value = config.messagingSenderId || '';
            return config;
        }
    } catch (e) {}
    return null;
}

function firebaseSaveConfig(e) {
    e.preventDefault();
    const config = {
        apiKey: document.getElementById('fbApiKey').value.trim(),
        projectId: document.getElementById('fbProjectId').value.trim(),
        storageBucket: document.getElementById('fbStorageBucket').value.trim(),
        appId: document.getElementById('fbAppId').value.trim(),
        messagingSenderId: document.getElementById('fbMessagingSenderId').value.trim()
    };
    if (!config.apiKey || !config.projectId || !config.storageBucket || !config.appId) {
        alert('Completa apiKey, projectId, storageBucket y appId.');
        return;
    }
    localStorage.setItem('firebase_config', JSON.stringify(config));
    firebaseInit(config);
}

function firebaseDisconnect() {
    localStorage.removeItem('firebase_config');
    firebaseApp = null;
    firestoreDb = null;
    storageRef = null;
    firebaseReady = false;
    updateFirebaseStatus();
    location.reload();
}

function firebaseInit(config) {
    try {
        firebaseApp = firebase.initializeApp(config, 'multitechco');
        firestoreDb = firebaseApp.firestore();
        storageRef = firebaseApp.storage().ref();
        firebaseReady = true;
        updateFirebaseStatus();
        firebaseLoadProducts();
    } catch (e) {
        console.error('Firebase init error:', e);
        alert('Error al conectar con Firebase: ' + e.message);
    }
}

function updateFirebaseStatus() {
    const el = document.getElementById('firebaseStatus');
    if (!el) return;
    if (firebaseReady) {
        el.innerHTML = '<span class="text-green-700 font-semibold">✓ Conectado a Firebase.</span> Los productos se guardan en la nube.';
    } else {
        el.innerHTML = 'No configurado. Los productos solo viven en memoria local.';
    }
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

async function firebaseUploadImage(file) {
    if (!storageRef) throw new Error('Firebase no conectado');
    const fileName = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g, '');
    const ref = storageRef.child('productos/' + fileName);
    const snapshot = await ref.put(file);
    return await snapshot.ref.getDownloadURL();
}

async function adminDeleteProduct(id) {
    if (!confirm('¿Eliminar este producto permanentemente?')) return;
    products = products.filter(p => p.id !== id);
    if (firebaseReady) await firebaseDeleteProductFromCloud(id);
    adminRenderTable();
    refreshSiteProducts();
}

// Init Firebase on page load
const savedConfig = firebaseLoadConfig();
if (savedConfig) {
    setTimeout(() => firebaseInit(savedConfig), 500);
}
updateFirebaseStatus();
