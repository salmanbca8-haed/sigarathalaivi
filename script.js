const ADMIN_PASSWORD = 'Admin@123';
const STORAGE_KEY = 'sigarathalaivi_products';
const STORAGE_CART = 'sigarathalaivi_cart';
const STORAGE_ADMIN = 'sigarathalaivi_admin';

const defaultProducts = [
  { id: 'wood-gingelly-oil', name: 'WOOD PRESSED GINGELLY OIL', price: 349, image: './image/WOOD PRESSED  GINGELLY OIL.jpeg', description: 'Pure cold-pressed sesame oil for healthy cooking.', stock: 18 },
  { id: 'ragi-mix-powder', name: 'RAGI MIX POWDER', price: 220, image: './image/RAGI MIX POWDER.jpeg', description: 'A nourishing millet mix for dosa and porridge.', stock: 24 },
  { id: 'palm-jaggery-peanut-balls', name: 'PALM JAGGERY PEANUT BALLS', price: 140, image: './image/PALM JAGGERY PEANUT BALLS.jpeg', description: 'Sweet energy bites made with palm jaggery and peanuts.', stock: 12 },
  { id: 'ellu-urudai', name: 'ELLU URUDAI', price: 175, image: './image/ELLU URUDAI.jpeg', description: 'Traditional sesame snacks made with premium ingredients.', stock: 20 },
  { id: 'kambu-murukku', name: 'KAMBU MURUKKU', price: 180, image: './image/KAMBU MURUKKU.jpeg', description: 'Crispy pearl millet murukku for tea time.', stock: 16 },
  { id: 'shikakai-powder', name: 'SIKAKAI POWDER', price: 220, image: './image/SIKAKAI POWDER.jpeg', description: 'Natural hair cleanser from authentic shikakai pods.', stock: 14 },
  { id: 'varagu-seedai', name: 'VARAGU SEEDAI', price: 160, image: './image/VARAGU SEEDAI.jpeg', description: 'Savory millet seedai with a crisp texture.', stock: 20 },
  { id: 'thinai-laddu', name: 'THINAI LADDU', price: 190, image: './image/THINAI LADDU.jpeg', description: 'Healthy foxtail millet laddus with jaggery and ghee.', stock: 18 },
  { id: 'nalangu-maavu', name: 'NALANGU MAAVU', price: 210, image: './image/NALANGU MAAVU.jpeg', description: 'Nutritious powder mix for traditional ceremonies.', stock: 22 },
  { id: 'kuthiraivali', name: 'KUTHIRAIVALI', price: 150, image: './image/KUTHIRAIVALI.jpeg', description: 'Wholesome horse gram grain for nutritious cooking.', stock: 25 },
  { id: 'karuppu-kavuni-rice', name: 'KARUPPU KAVUNI RICE', price: 290, image: './image/KARUPPU KAVUNI RICE.jpeg', description: 'Aromatic black kavuni rice with rich traditional flavor.', stock: 10 },
  { id: 'camphor-karpooram', name: 'CAMPHOR KARPOORAM', price: 95, image: './image/CAMPHOR KARPOORAM.jpeg', description: 'Natural camphor balls for pooja and home fragrance.', stock: 30 },
  { id: 'dish-wash-gel', name: 'DISH WASH GEL', price: 125, image: './image/DISH WASH GELL.jpeg', description: 'Gentle dish cleaning gel for sparkling utensils.', stock: 20 },
  { id: 'floor-cleaner', name: 'FLOOR CLEANER', price: 160, image: './image/FLOOR CLEANER.jpeg', description: 'Fragrant floor cleaner for safe and shiny surfaces.', stock: 22 },
  { id: 'toilet-cleaner', name: 'TOILET CLEANER', price: 135, image: './image/TOILET CLEANER.jpeg', description: 'Powerful cleaning gel for fresh washrooms.', stock: 18 },
  { id: 'all-purpose-cleaner', name: 'ALL PURPOSE CLEANER', price: 145, image: './image/ALL PURPOSE CLEANER.jpeg', description: 'Multi-surface cleaner for kitchen and home use.', stock: 26 }
];

let products = [];
let cart = [];
let cartCount = 0;

const elements = {
  productGrid: document.getElementById('productGrid'),
  adminSection: document.getElementById('adminSection'),
  adminLoginArea: document.getElementById('adminLoginArea'),
  adminDashboard: document.getElementById('adminDashboard'),
  adminLoginForm: document.getElementById('adminLoginForm'),
  adminPassword: document.getElementById('adminPassword'),
  adminLogoutBtn: document.getElementById('adminLogoutBtn'),
  adminProducts: document.getElementById('adminProducts'),
  adminSearchInput: document.getElementById('adminSearch'),
  addProductForm: document.getElementById('addProductForm'),
  newImageInput: document.getElementById('newImage'),
  newImagePreview: document.getElementById('newImagePreview'),
  cartItemsContainer: document.getElementById('cartItemsContainer'),
  cartTotalItems: document.getElementById('cartTotalItems'),
  cartTotalAmount: document.getElementById('cartTotalAmount'),
  cartCount: document.getElementById('cartCount'),
  orderName: document.getElementById('orderName'),
  orderPhone: document.getElementById('orderPhone'),
  orderAddress: document.getElementById('orderAddress'),
  sendWhatsappBtn: document.getElementById('sendWhatsappBtn'),
  sendEmailBtn: document.getElementById('sendEmailBtn'),
  viewCartBtn: document.getElementById('viewCartBtn'),
  adminAccessBtn: document.getElementById('adminAccessBtn'),
  messageBox: document.getElementById('messageBox')
};

let newProductImageData = '';
let adminSearchQuery = '';

function loadProducts() {
  const data = localStorage.getItem(STORAGE_KEY);
  products = data ? JSON.parse(data) : defaultProducts.slice();
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function loadCart() {
  const data = localStorage.getItem(STORAGE_CART);
  cart = data ? JSON.parse(data) : [];
  updateCartCount();
}

function saveCart() {
  localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
}

function updateCartCount() {
  cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (elements.cartCount) {
    elements.cartCount.textContent = cartCount;
  }
  if (elements.cartTotalItems) {
    elements.cartTotalItems.textContent = cartCount;
  }
}

function getAdminState() {
  return localStorage.getItem(STORAGE_ADMIN) === 'true';
}

function setAdminState(value) {
  localStorage.setItem(STORAGE_ADMIN, value ? 'true' : 'false');
}

function renderProducts() {
  elements.productGrid.innerHTML = products
    .map(product => `
      <div class="card">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="card-content">
          <h3>${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <p class="price">₹${product.price}</p>
          <button class="buy-btn add-cart-btn" data-id="${product.id}">${product.stock > 0 ? 'Add To Cart' : 'Out of stock'}</button>
        </div>
      </div>
    `)
    .join('');

  document.querySelectorAll('.add-cart-btn').forEach(button => {
    button.addEventListener('click', handleAddToCart);
  });
}

function renderCartItems() {
  if (!elements.cartItemsContainer) return;
  if (!cart.length) {
    elements.cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
    if (elements.cartTotalAmount) elements.cartTotalAmount.textContent = '₹0';
    if (elements.cartTotalItems) elements.cartTotalItems.textContent = '0';
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  elements.cartItemsContainer.innerHTML = cart
    .map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>₹${item.price} each</p>
          <p>Subtotal: ₹${item.price * item.quantity}</p>
          <div class="quantity-control">
            <button class="cart-qty-btn" data-id="${item.id}" data-action="decrease">-</button>
            <span>${item.quantity}</span>
            <button class="cart-qty-btn" data-id="${item.id}" data-action="increase">+</button>
          </div>
        </div>
        <button class="secondary-btn cart-remove-btn" data-id="${item.id}">Remove</button>
      </div>
    `)
    .join('');

  if (elements.cartTotalAmount) elements.cartTotalAmount.textContent = `₹${total}`;
  if (elements.cartTotalItems) elements.cartTotalItems.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  elements.cartItemsContainer.querySelectorAll('.cart-qty-btn').forEach(button => {
    button.addEventListener('click', handleCartQuantityChange);
  });
  elements.cartItemsContainer.querySelectorAll('.cart-remove-btn').forEach(button => {
    button.addEventListener('click', handleRemoveCartItem);
  });
}

function getFilteredProducts() {
  if (!adminSearchQuery.trim()) {
    return products;
  }
  const query = adminSearchQuery.trim().toLowerCase();
  return products.filter(product => product.name.toLowerCase().includes(query));
}

function renderAdminProducts() {
  if (!elements.adminProducts) return;
  const visibleProducts = getFilteredProducts();

  if (!visibleProducts.length) {
    elements.adminProducts.innerHTML = '<div class="no-results">No products found.</div>';
    return;
  }

  elements.adminProducts.innerHTML = visibleProducts
    .map(product => `
      <div class="admin-row">
        <div class="admin-row-main">
          <img src="${product.image}" alt="${product.name}" class="admin-image-preview">
          <div>
            <strong>${product.name}</strong>
            <p>${product.description}</p>
          </div>
        </div>
        <div class="admin-fields">
          <label>Price<br><input type="number" data-id="${product.id}" data-field="price" value="${product.price}"></label>
          <label>Stock<br><input type="number" data-id="${product.id}" data-field="stock" value="${product.stock}"></label>
          <label>Upload Image<br><input type="file" class="product-image-input" data-id="${product.id}" accept="image/*"></label>
          <button class="secondary-btn admin-update-btn" data-id="${product.id}">Update</button>
          <button class="secondary-btn admin-delete-btn" data-id="${product.id}">Delete</button>
        </div>
      </div>
    `)
    .join('');

  elements.adminProducts.querySelectorAll('.admin-update-btn').forEach(button => {
    button.addEventListener('click', handleAdminUpdate);
  });
  elements.adminProducts.querySelectorAll('.admin-delete-btn').forEach(button => {
    button.addEventListener('click', handleAdminDelete);
  });
  elements.adminProducts.querySelectorAll('.product-image-input').forEach(input => {
    input.addEventListener('change', handleAdminProductImageSelect);
  });
}

function showMessage(text, type = 'info') {
  if (!elements.messageBox) return;
  elements.messageBox.textContent = text;
  elements.messageBox.className = `message-box ${type}`;
  elements.messageBox.style.opacity = '1';
  setTimeout(() => {
    elements.messageBox.style.opacity = '0';
  }, 3200);
}

function handleAddToCart(event) {
  const productId = event.target.dataset.id;
  const product = products.find(item => item.id === productId);
  if (!product || product.stock < 1) {
    showMessage('Product is out of stock.', 'warning');
    return;
  }

  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
  }

  saveCart();
  updateCartCount();
  renderCartItems();
  showMessage(`${product.name} added to cart.`, 'success');
}

function handleCartQuantityChange(event) {
  const productId = event.target.dataset.id;
  const action = event.target.dataset.action;
  const cartItem = cart.find(item => item.id === productId);
  if (!cartItem) return;

  if (action === 'increase') {
    cartItem.quantity += 1;
  } else if (action === 'decrease') {
    cartItem.quantity -= 1;
  }

  if (cartItem.quantity < 1) {
    cart = cart.filter(item => item.id !== productId);
  }

  saveCart();
  updateCartCount();
  renderCartItems();
}

function handleRemoveCartItem(event) {
  const productId = event.target.dataset.id;
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartCount();
  renderCartItems();
}

function buildOrderMessage() {
  const name = elements.orderName.value.trim();
  const phone = elements.orderPhone.value.trim();
  const address = elements.orderAddress.value.trim();

  if (!name || !phone || !address) {
    showMessage('Please fill name, phone and address before sending the order.', 'warning');
    return null;
  }

  if (!cart.length) {
    showMessage('Your cart is empty.', 'warning');
    return null;
  }

  let message = `New order from ${name}%0A`;
  message += `Phone: ${phone}%0A`;
  message += `Address: ${address}%0A%0A`;
  message += `Order details:%0A`;
  cart.forEach(item => {
    message += `${item.name} x${item.quantity} - ₹${item.price * item.quantity}%0A`;
  });
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `%0ATotal: ₹${total}`;
  return message;
}

function handleSendWhatsapp() {
  const message = buildOrderMessage();
  if (!message) return;
  const phoneNumber = '9345019500';
  const url = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(url, '_blank');
}

function handleSendEmail() {
  const name = elements.orderName.value.trim();
  const phone = elements.orderPhone.value.trim();
  const address = elements.orderAddress.value.trim();

  if (!name || !phone || !address) {
    showMessage('Please fill name, phone and address before sending the order.', 'warning');
    return;
  }

  if (!cart.length) {
    showMessage('Your cart is empty.', 'warning');
    return;
  }

  let body = `New order from ${name}\n`;
  body += `Phone: ${phone}\n`;
  body += `Address: ${address}\n\n`;
  body += `Order details:\n`;
  cart.forEach(item => {
    body += `${item.name} x${item.quantity} - ₹${item.price * item.quantity}\n`;
  });
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  body += `\nTotal: ₹${total}`;

  const subject = 'New Order to Sigarathalaivi';
  const mailto = `mailto:vimal.raj.0031@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}

function handleAdminAccess() {
  elements.adminSection.classList.remove('hidden');
  if (getAdminState()) {
    showAdminDashboard();
  } else {
    showAdminLogin();
  }
  elements.adminSection.scrollIntoView({ behavior: 'smooth' });
}

function showAdminLogin() {
  elements.adminLoginArea.classList.remove('hidden');
  elements.adminDashboard.classList.add('hidden');
  elements.adminLogoutBtn.classList.add('hidden');
}

function showAdminDashboard() {
  elements.adminLoginArea.classList.add('hidden');
  elements.adminDashboard.classList.remove('hidden');
  elements.adminLogoutBtn.classList.remove('hidden');
  renderAdminProducts();
}

function handleAdminLogin(event) {
  event.preventDefault();
  const password = elements.adminPassword.value.trim();
  if (password === ADMIN_PASSWORD) {
    setAdminState(true);
    showMessage('Admin access granted.', 'success');
    showAdminDashboard();
    elements.adminPassword.value = '';
  } else {
    showMessage('Incorrect password. Try again.', 'warning');
  }
}

function handleAdminLogout() {
  setAdminState(false);
  showAdminLogin();
  showMessage('Admin logged out.', 'info');
}

function handleAdminUpdate(event) {
  const productId = event.target.dataset.id;
  const product = products.find(item => item.id === productId);
  if (!product) return;

  const row = event.target.closest('.admin-row');
  const priceInput = row.querySelector('input[data-field="price"]');
  const stockInput = row.querySelector('input[data-field="stock"]');
  const fileInput = row.querySelector('.product-image-input');

  product.price = Number(priceInput.value) || product.price;
  product.stock = Number(stockInput.value) || product.stock;

  if (fileInput && fileInput.files && fileInput.files[0]) {
    readImageFile(fileInput.files[0], base64 => {
      product.image = base64;
      saveProducts();
      renderProducts();
      renderAdminProducts();
      showMessage(`${product.name} updated successfully.`, 'success');
    });
    return;
  }

  saveProducts();
  renderProducts();
  renderAdminProducts();
  showMessage(`${product.name} updated successfully.`, 'success');
}

function handleAdminDelete(event) {
  const productId = event.target.dataset.id;
  products = products.filter(item => item.id !== productId);
  saveProducts();
  renderProducts();
  renderAdminProducts();
  showMessage('Product removed from the catalog.', 'info');
}

function handleAddProduct(event) {
  event.preventDefault();
  const name = document.getElementById('newName').value.trim();
  const price = Number(document.getElementById('newPrice').value || 0);
  const description = document.getElementById('newDescription').value.trim();
  const stock = Number(document.getElementById('newStock').value || 1);
  const file = elements.newImageInput.files && elements.newImageInput.files[0];

  if (!name || !file || price <= 0) {
    showMessage('Provide a name, upload an image and valid price.', 'warning');
    return;
  }

  readImageFile(file, base64 => {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    products.unshift({ id, name, price, image: base64, description: description || 'Premium store product.', stock });
    saveProducts();
    renderProducts();
    renderAdminProducts();
    elements.addProductForm.reset();
    elements.newImagePreview.src = '';
    elements.newImagePreview.parentElement.style.display = 'none';
    newProductImageData = '';
    showMessage(`${name} added to the catalog.`, 'success');
  });
}

function handleAdminProductImageSelect(event) {
  const fileInput = event.target;
  const productId = fileInput.dataset.id;
  const file = fileInput.files && fileInput.files[0];
  if (!file) return;

  readImageFile(file, base64 => {
    const row = fileInput.closest('.admin-row');
    const preview = row.querySelector('.admin-image-preview');
    if (preview) preview.src = base64;
    const product = products.find(item => item.id === productId);
    if (product) {
      product.image = base64;
      saveProducts();
      renderProducts();
    }
  });
}

function readImageFile(file, callback) {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function handleSearchInput(event) {
  adminSearchQuery = event.target.value;
  renderAdminProducts();
}

function initializeNavigation() {
  document.querySelectorAll('#navLinks a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('navLinks').classList.remove('show');
      document.getElementById('hamburger').classList.remove('active');
    });
  });
}

function init() {
  loadProducts();
  loadCart();
  renderProducts();
  renderCartItems();
  initializeNavigation();
  if (getAdminState()) {
    elements.adminSection.classList.remove('hidden');
    showAdminDashboard();
  }
  elements.adminAccessBtn.addEventListener('click', handleAdminAccess);
  elements.adminLoginForm.addEventListener('submit', handleAdminLogin);
  elements.adminLogoutBtn.addEventListener('click', handleAdminLogout);
  elements.addProductForm.addEventListener('submit', handleAddProduct);
  elements.viewCartBtn.addEventListener('click', () => {
    document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
  });
  elements.newImageInput.addEventListener('change', event => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      elements.newImagePreview.src = '';
      elements.newImagePreview.parentElement.style.display = 'none';
      return;
    }
    readImageFile(file, base64 => {
      newProductImageData = base64;
      elements.newImagePreview.src = base64;
      elements.newImagePreview.parentElement.style.display = 'block';
    });
  });
  if (elements.adminSearchInput) {
    elements.adminSearchInput.addEventListener('input', handleSearchInput);
  }
  if (elements.sendWhatsappBtn) {
    elements.sendWhatsappBtn.addEventListener('click', handleSendWhatsapp);
  }
  if (elements.sendEmailBtn) {
    elements.sendEmailBtn.addEventListener('click', handleSendEmail);
  }
}

window.addEventListener('DOMContentLoaded', init);
