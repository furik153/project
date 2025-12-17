document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();

    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});

function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyMessage = document.getElementById('empty-cart-message');
    const cartActions = document.getElementById('cart-actions');

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        if (cartActions) cartActions.style.display = 'none';
        updateCartSummary(0, 0);
        return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';
    if (cartActions) cartActions.style.display = 'flex';

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += Number(item.price) * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <h4>${item.name}</h4>
            <button class="decrease-quantity" data-id="${item.id}">−</button>
            <span>${item.quantity}</span>
            <button class="increase-quantity" data-id="${item.id}">+</button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    addCartItemEventListeners();
    updateCartSummary(totalItems, totalPrice);
}
function addCartItemEventListeners() {
    document.querySelectorAll('.decrease-quantity').forEach(btn =>
        btn.addEventListener('click', () =>
            updateCartItemQuantity(btn.dataset.id, -1)
        )
    );

    document.querySelectorAll('.increase-quantity').forEach(btn =>
        btn.addEventListener('click', () =>
            updateCartItemQuantity(btn.dataset.id, 1)
        )
    );

    document.querySelectorAll('.remove-item-btn').forEach(btn =>
        btn.addEventListener('click', () =>
            removeCartItem(btn.dataset.id)
        )
    );
}

function updateCartItemQuantity(id, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity < 1) {
        cart = cart.filter(i => i.id !== id);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount?.();
}

function removeCartItem(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount?.();

    showNotification('Товар видалено з кошика');
}

function clearCart() {
    if (!confirm('Ви впевнені, що хочете очистити кошик?')) return;

    localStorage.removeItem('cart');
    displayCartItems();
    updateCartCount?.();

    showNotification('Кошик очищено');
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('Ваш кошик порожній');
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    alert(`Замовлення оформлено на суму ${formatPrice(total)} ₴`);
}

function updateCartSummary(totalItems, totalPrice) {
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-price').textContent = formatPrice(totalPrice);
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function showNotification(text) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = text;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}