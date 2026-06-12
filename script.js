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
    { id: 15, name: "Hub USB-C 7 en 1", price: 65000, category: "accesorios", image: "https://images.unsplash.com/photo-1619953942547-233eab5a70d6?w=800&q=80", tag: "Oferta", material: "aluminio", originalPrice: 85000 },
    { id: 16, name: "Televisor QLED 65\" 4K Smart TV", price: 2890000, category: "tecno", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80", tag: "Oferta", material: "metal", originalPrice: 3490000 },
    { id: 17, name: "Televisor OLED 55\" 4K Dolby Vision", price: 3450000, category: "tecno", image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=80", tag: "Oferta", material: "metal", originalPrice: 4190000 },
    { id: 18, name: "Televisor 75\" Mini LED 8K", price: 7250000, category: "tecno", image: "https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=800&q=80", tag: "Oferta", material: "metal", originalPrice: 8490000 },
    { id: 19, name: "Televisor 50\" UHD 4K Smart TV", price: 1590000, category: "tecno", image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80", tag: "Oferta", material: "metal", originalPrice: 1890000 }
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
    body.innerHTML = `
        <div class="md:w-1/2 bg-surface-container-low h-80 md:h-auto">
            <img src="${p.image}" class="w-full h-full object-cover">
        </div>
        <div class="md:w-1/2 p-12 flex flex-col justify-center">
            <span class="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">${p.category} | ${p.tag}</span>
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
    window.open('https://wa.me/573006298971?text=¡Hola! Quiero conocer más sobre sus productos premium.', '_blank');
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
    checkAdminAccess();

    // World Cup section — physics ball crash
    const wcSection = document.querySelector('.worldcup-section');
    if (wcSection) {
        let animTriggered = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animTriggered) {
                    animTriggered = true;
                    const ball = document.getElementById('worldcupBall');
                    const glass = document.getElementById('worldcupGlass');
                    const flash = document.getElementById('worldcupFlash');
                    const content = document.getElementById('worldcupContent');
                    const cracks = document.querySelectorAll('.crack');
                    const shards = document.querySelectorAll('.shard');
                    if (!ball) return;

                    const rect = wcSection.getBoundingClientRect();
                    const startX = -120;
                    const endX = rect.width * 0.5;
                    const startY = rect.height * 0.75;
                    const endY = rect.height * 0.43;
                    const arcHeight = -rect.height * 0.3;
                    const duration = 2000;
                    const totalRotation = 1440;
                    const startTime = performance.now();

                    function frame(now) {
                        const elapsed = now - startTime;
                        let t = Math.min(elapsed / duration, 1);

                        // ease-out for position: fast start, slow finish
                        const easePos = 1 - Math.pow(1 - t, 1.8);
                        const x = startX + (endX - startX) * easePos;
                        const linearY = startY + (endY - startY) * easePos;
                        const arc = 4 * arcHeight * easePos * (1 - easePos);
                        const y = linearY + arc;

                        // scale ramps up fast near the end
                        const scale = 0.12 + Math.pow(t, 2.5) * 11.88;
                        const rotation = totalRotation * easePos;

                        ball.style.left = x + 'px';
                        ball.style.top = y + 'px';
                        ball.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
                        ball.style.opacity = t < 0.04 ? String(t / 0.04) : '1';

                        if (t < 1) {
                            requestAnimationFrame(frame);
                        } else {
                            // Hide ball on impact
                            ball.style.opacity = '0';
                            // Impact sequence
                            flash?.classList.add('flash');
                            cracks.forEach(c => c.classList.add('animate'));
                            setTimeout(() => {
                                glass?.classList.add('shatter');
                                shards.forEach(s => s.classList.add('animate'));
                            }, 250);
                            setTimeout(() => {
                                content?.classList.add('animate');
                            }, 650);
                        }
                    }
                    requestAnimationFrame(frame);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(wcSection);
    }
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
        const description = document.getElementById('adminDescription').value.trim();
        const fileInput = document.getElementById('adminImageFile');
        const preview = document.getElementById('adminImagePreview');
        let image = document.getElementById('adminImage').value.trim();

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

        const product = { id: 0, name, price, category, tag, material, image, description };
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
    document.getElementById('adminDescription').value = p.description || '';
    document.getElementById('adminImage').value = '';
    const preview = document.getElementById('adminImagePreview');
    preview.src = p.image;
    preview.classList.remove('hidden');
    window.scrollTo({ top: document.getElementById('adminForm').offsetTop - 120, behavior: 'smooth' });
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
