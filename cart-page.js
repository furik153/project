document.addEventListener('DOMContentLoaded', function () {

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
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartActions = document.getElementById('cart-actions');


    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartActions.style.display = 'none';


        updateCartSummary(0, 0);
        return;
    }


    emptyCartMessage.style.display = 'none';
    cartActions.style.display = 'flex';

    let totalItems = 0;
    let totalPrice = 0;


    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalItems += item.quantity;
        totalPrice += itemTotal;

        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.setAttribute('data-id', item.id);


        cartItemsContainer.appendChild(cartItemElement);
    });

    addCartItemEventListeners();


    updateCartSummary(totalItems, totalPrice);
}

function addCartItemEventListeners() {

    const decreaseButtons = document.querySelectorAll('.decrease-quantity');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');
            updateCartItemQuantity(productId, -1);
        });
    });

    const increaseButtons = document.querySelectorAll('.increase-quantity');
    increaseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');
            updateCartItemQuantity(productId, 1);
        });
    });

    const removeButtons = document.querySelectorAll('.remove-item-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');
            removeCartItem(productId);
        });
    });
}

function updateCartItemQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;


        if (cart[itemIndex].quantity < 1) {
            cart.splice(itemIndex, 1);
        }


        localStorage.setItem('cart', JSON.stringify(cart));


        displayCartItems();

        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
    }
}

function removeCartItem(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);


    localStorage.setItem('cart', JSON.stringify(cart));


    displayCartItems();

    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }


    showNotification('Товар видалено з кошика');
}

function clearCart() {
    if (confirm('Ви впевнені, що хочете очистити кошик?')) {
        localStorage.removeItem('cart');
        displayCartItems();


        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }


        showNotification('Кошик очищено');
    }
}


function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('Ваш кошик порожній. Додайте товари перед оформленням замовлення.');
        return;
    }

    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);



    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
}

function updateCartSummary(totalItems, totalPrice) {
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');

    if (totalItemsElement) {
        totalItemsElement.textContent = totalItems;
    }

    if (totalPriceElement) {
        totalPriceElement.textContent = $formatPrice(totalPrice)
    };
}



function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


document.body.appendChild(notification);

setTimeout(() => {
    notification.style.transform = 'translateX(0)';
}, 10);

setTimeout(() => {
    notification.style.transform = 'translateX(150%)';
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 300);
}, 3000);
