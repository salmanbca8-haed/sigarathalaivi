/* =========================================================
   SIGARATHALAIVI LUXURY DIAMONDFALL STORE — SITE JS
   Isolated in an IIFE to prevent collisions with hero scrub
   ========================================================= */
(() => {
  'use strict';

  // --- STATE ---
  const cart = [];
  let toastTimer = null;

  // --- DOM ELEMENTS ---
  const siteMain = document.getElementById('site');
  const bgLayer = document.getElementById('sgAiBg');
  const hamburger = document.getElementById('sgHamburger');
  const navLinks = document.getElementById('sgNavLinks');
  const cartBtn = document.getElementById('sgCartBtn');
  const cartCountEl = document.getElementById('sgCartCount');
  const cartOverlay = document.getElementById('sgCartOverlay');
  const cartDrawer = document.getElementById('sgCartDrawer');
  const cartCloseBtn = document.getElementById('sgCartClose');
  const cartItemsContainer = document.getElementById('sgCartItems');
  const toastEl = document.getElementById('sgToast');

  const cartTotalAmountEl = document.getElementById('sgCartTotalAmount');

  // --- 1. INTERSECTION OBSERVER FOR LUXURY BACKGROUND ---
  // Keeps diamond/sparkle/glow background strictly active only while #site is in view
  if (siteMain && bgLayer && 'IntersectionObserver' in window) {
    const bgObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            bgLayer.classList.add('sg-active');
          } else {
            bgLayer.classList.remove('sg-active');
          }
        });
      },
      { threshold: 0.01, rootMargin: '50px 0px 50px 0px' }
    );
    bgObserver.observe(siteMain);
  }

  // --- 2. MOBILE HAMBURGER MENU & SMOOTH SCROLL ---
  function toggleMobileMenu() {
    if (navLinks) navLinks.classList.toggle('show');
    if (hamburger) hamburger.classList.toggle('active');
  }

  function closeMobileMenu() {
    if (navLinks) navLinks.classList.remove('show');
    if (hamburger) hamburger.classList.remove('active');
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMobileMenu();
      }
    });
  }

  // Close menu when a link is clicked and smooth scroll
  if (navLinks) {
    const links = navLinks.querySelectorAll('a');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        closeMobileMenu();
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          if (href === '#heroTrack') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const targetEl = document.querySelector(href);
            if (targetEl) {
              const navOffset = 70;
              const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navOffset;
              window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
          }
        }
      });
    });
  }

  // Logo scroll to top (Scroll Hero)
  const logoLink = document.querySelector('.sg-logo');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 3. TOAST NOTIFICATION ---
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  }

  // --- 4. CART LOGIC ---
  function updateCartUI() {
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartCountEl) cartCountEl.textContent = totalQty;
    if (cartTotalAmountEl) cartTotalAmountEl.textContent = `₹${totalAmount}`;

    if (cartItemsContainer) {
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="sg-cart-empty">Your luxury cart is currently empty.</div>';
      } else {
        cartItemsContainer.innerHTML = cart
          .map(
            (item) => `
          <div class="sg-cart-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='./image/image.png'">
            <div class="sg-cart-item-details">
              <h4>${item.name}</h4>
              <p>₹${item.price} each · Subtotal: ₹${item.price * item.quantity}</p>
            </div>
            <div class="sg-cart-item-qty">
              <button class="sg-qty-btn" data-name="${item.name}" data-action="dec" aria-label="Decrease quantity">-</button>
              <span>${item.quantity}</span>
              <button class="sg-qty-btn" data-name="${item.name}" data-action="inc" aria-label="Increase quantity">+</button>
            </div>
          </div>
        `
          )
          .join('');

        // Attach quantity buttons
        cartItemsContainer.querySelectorAll('.sg-qty-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            const action = btn.getAttribute('data-action');
            const item = cart.find((i) => i.name === name);
            if (!item) return;

            if (action === 'inc') {
              item.quantity += 1;
            } else if (action === 'dec') {
              item.quantity -= 1;
              if (item.quantity <= 0) {
                const idx = cart.indexOf(item);
                if (idx > -1) cart.splice(idx, 1);
              }
            }
            updateCartUI();
          });
        });
      }
    }
  }

  function addToCart(productName, productImage, price = 0) {
    const existing = cart.find((i) => i.name === productName);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        name: productName,
        image: productImage,
        price: price,
        quantity: 1
      });
    }
    updateCartUI();
    showToast(`✓ ${productName} added to cart (₹${price})!`);
  }

  // Attach Add to Cart buttons
  document.querySelectorAll('.sg-buy-btn').forEach((button) => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.sg-card');
      const name = e.target.getAttribute('data-name') || (card ? card.querySelector('h3').textContent.trim() : 'Product');
      const img = card ? card.querySelector('img').getAttribute('src') : './image/image.png';
      const priceAttr = e.target.getAttribute('data-price');
      let price = 0;
      if (priceAttr) {
        price = Number(priceAttr);
      } else if (card) {
        const priceText = card.querySelector('.sg-price').textContent;
        price = Number(priceText.replace(/[^\d]/g, '')) || 0;
      }
      addToCart(name, img, price);
    });
  });

  // Open/Close Cart Drawer
  function openCart() {
    if (cartOverlay) cartOverlay.classList.add('show');
    if (cartDrawer) cartDrawer.classList.add('show');
  }

  function closeCart() {
    if (cartOverlay) cartOverlay.classList.remove('show');
    if (cartDrawer) cartDrawer.classList.remove('show');
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // --- 5. CHECKOUT, WHATSAPP ORDER & CONFIRMATION POPUP ---
  const whatsappBtn = document.getElementById('sgWhatsappOrderBtn');
  const customerNameInput = document.getElementById('sgCustomerName');
  const customerPhoneInput = document.getElementById('sgCustomerPhone');
  const customerAddressInput = document.getElementById('sgCustomerAddress');

  const popupOverlay = document.getElementById('sgPopupOverlay');
  const popupCloseBtn = document.getElementById('sgPopupClose');
  const popupDoneBtn = document.getElementById('sgPopupDoneBtn');
  const popupOrderIdEl = document.getElementById('sgPopupOrderId');
  const popupDateTimeEl = document.getElementById('sgPopupDateTime');
  const popupNameEl = document.getElementById('sgPopupName');
  const popupPhoneEl = document.getElementById('sgPopupPhone');
  const popupAddressEl = document.getElementById('sgPopupAddress');
  const popupItemsListEl = document.getElementById('sgPopupItemsList');
  const popupTotalEl = document.getElementById('sgPopupTotal');

  function openPopup(orderId, dateTime, name, phone, address, items, grandTotal) {
    if (popupOrderIdEl) popupOrderIdEl.textContent = `Order ID: #${orderId}`;
    if (popupDateTimeEl) popupDateTimeEl.textContent = dateTime;
    if (popupNameEl) popupNameEl.textContent = name;
    if (popupPhoneEl) popupPhoneEl.textContent = phone;
    if (popupAddressEl) popupAddressEl.textContent = address;
    if (popupTotalEl) popupTotalEl.textContent = `₹${grandTotal}`;

    if (popupItemsListEl) {
      popupItemsListEl.innerHTML = items
        .map(
          (item) => `
        <div class="sg-popup-item-row">
          <span>${item.name} <span class="qty">x${item.quantity}</span></span>
          <strong>₹${item.price * item.quantity}</strong>
        </div>
      `
        )
        .join('');
    }

    if (popupOverlay) {
      popupOverlay.classList.add('show');
      popupOverlay.setAttribute('aria-hidden', 'false');
    }
  }

  function closePopup() {
    if (popupOverlay) {
      popupOverlay.classList.remove('show');
      popupOverlay.setAttribute('aria-hidden', 'true');
    }
    // Clear cart and reset form after confirmed order
    cart.length = 0;
    if (customerNameInput) customerNameInput.value = '';
    if (customerPhoneInput) customerPhoneInput.value = '';
    if (customerAddressInput) customerAddressInput.value = '';
    updateCartUI();
    showToast('நன்றி! Thank you for ordering with சிகரத்தலைவி!');
  }

  if (popupCloseBtn) popupCloseBtn.addEventListener('click', closePopup);
  if (popupDoneBtn) popupDoneBtn.addEventListener('click', closePopup);
  if (popupOverlay) {
    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) {
        closePopup();
      }
    });
  }

  // Handle WhatsApp Checkout
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Please add products to your cart first.');
        return;
      }

      const name = customerNameInput ? customerNameInput.value.trim() : '';
      const phone = customerPhoneInput ? customerPhoneInput.value.trim() : '';
      const address = customerAddressInput ? customerAddressInput.value.trim() : '';

      if (!name) {
        showToast('Please enter your full name for delivery.');
        if (customerNameInput) customerNameInput.focus();
        return;
      }

      if (!phone || phone.length < 6) {
        showToast('Please enter a valid phone number.');
        if (customerPhoneInput) customerPhoneInput.focus();
        return;
      }

      if (!address) {
        showToast('Please enter your delivery address.');
        if (customerAddressInput) customerAddressInput.focus();
        return;
      }

      // Generate unique luxury Order ID (e.g. SGT-582914)
      const orderNumber = Math.floor(100000 + Math.random() * 900000);
      const orderId = `SGT-${orderNumber}`;
      const grandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Format Date & Time (e.g. "29 Sep 2026, 09:35 PM")
      const now = new Date();
      const orderDateTime = now.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Construct formatted WhatsApp message
      let waMessage = `🛍️ *NEW ORDER - சிகரத்தலைவி LUXURY STORE*\n`;
      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `🆔 *Order ID:* #${orderId}\n`;
      waMessage += `📅 *Date & Time:* ${orderDateTime}\n`;
      waMessage += `👤 *Customer Name:* ${name}\n`;
      waMessage += `📞 *Phone Number:* ${phone}\n`;
      waMessage += `📍 *Delivery Address:*\n${address}\n`;
      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `📦 *ORDERED ITEMS:*\n`;

      cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        waMessage += `${index + 1}. ${item.name}\n   Qty: ${item.quantity} × ₹${item.price} = ₹${subtotal}\n`;
      });

      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `💰 *Grand Total:* ₹${grandTotal}\n`;
      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `✨ _Thank you for shopping with Sigarathalaivi Luxury Store!_`;

      const storeWhatsApp = '919629255773';
      const waUrl = `https://wa.me/${storeWhatsApp}?text=${encodeURIComponent(waMessage)}`;

      // 1. Open WhatsApp in new tab/app
      window.open(waUrl, '_blank');

      // 2. Close Cart Drawer
      closeCart();

      // 3. Show Order Confirmation Thank You Popup Modal
      openPopup(orderId, orderDateTime, name, phone, address, [...cart], grandTotal);
    });
  }

  // --- 6. INITIALIZE ---
  updateCartUI();
})();
