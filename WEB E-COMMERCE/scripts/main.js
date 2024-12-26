// Dummy Users (For Prototyping)
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null;

// Product Data
const products = [
    { id: 1, name: 'Smartphone', price: 200, image: 'images/smartphone.jpg' },
    { id: 2, name: 'Headphones', price: 50, image: 'images/headphones.jpg' },
    { id: 3, name: 'Laptop', price: 1000, image: 'images/laptop.jpg' },
];

// Cart Data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Render Products
function renderProducts() {
    const productList = document.getElementById('productList');
    if (!productList) {
        console.error('Error: Element with ID "productList" not found!');
        return;
    }

    productList.innerHTML = products
        .map(
            (product) => `
            <div class="col-md-4 mb-4">
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid">
                    <h5>${product.name}</h5>
                    <p>$${product.price}</p>
                    <button class="btn btn-warning" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>`
        )
        .join('');
}

// Add Product to Cart
function addToCart(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) {
        console.error('Error: Product not found!');
        return;
    }

    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
    renderCart();
}

// Render Cart
function renderCart() {
    const cartItemsElement = document.getElementById('cartItemsList');
    const cartTotalElement = document.getElementById('cartTotal');

    if (!cartItemsElement || !cartTotalElement) {
        console.error('Error: Cart element(s) not found!');
        return;
    }

    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p>Your cart is empty!</p>';
        cartTotalElement.innerHTML = '<h5>Total: $0.00</h5>';
        return;
    }

    cartItemsElement.innerHTML = cart
        .map(
            (item, index) => `
            <div class="cart-item">
                <h5>${item.name}</h5>
                <p>$${item.price}</p>
                <button class="btn btn-danger" onclick="removeFromCart(${index})">Remove</button>
            </div>`
        )
        .join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalElement.innerHTML = `<h5>Total: $${total}</h5>`;
}

// Remove Item from Cart
function removeFromCart(index) {
    if (index < 0 || index >= cart.length) {
        console.error('Error: Invalid cart index!');
        return;
    }

    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Checkout Process
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('checkoutTotal').textContent = `$${total}`;
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();
}

// Finalize Checkout
function finalizeCheckout() {
    const name = document.getElementById('customerName').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value;

    if (!name || !address || !phone || !paymentMethod) {
        alert('Please fill in all the details.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    alert(
        `Order Confirmed!\n\nName: ${name}\nAddress: ${address}\nPhone: ${phone}\nPayment Method: ${paymentMethod}\nTotal: $${total}\n\nThank you for shopping with us!`
    );

    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    document.getElementById('checkoutForm').reset();
    const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
    checkoutModal.hide();
}

// User Login
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
        alert(`Welcome, ${user.username}!`);
        currentUser = user;
        renderProducts();
    } else {
        alert('Invalid username or password!');
    }
});

// User Registration
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (users.find((u) => u.username === username)) {
        alert('Username already exists!');
        return;
    }

    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! You can now log in.');
});

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
});
