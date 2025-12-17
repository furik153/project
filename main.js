document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    const buttons = document.querySelectorAll('.add-to-cart-btn');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = Number(button.dataset.price);

            addToCart(id, name, price);
            animateButton(button);
        });
    });
});

function addToCart(id, name, price) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function animateButton(button) {
    const originalHTML = button.innerHTML;

    button.innerHTML = '<i class="fas fa-check"></i> додано!';
    button.disabled = true;
    button.style.backgroundColor = '#2ecc71';

    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.disabled = false;
        button.style.backgroundColor = '';
    }, 1200);
}