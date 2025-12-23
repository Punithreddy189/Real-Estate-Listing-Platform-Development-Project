const API_URL = 'http://localhost:5000/api';

document.addEventListener("DOMContentLoaded", () => {
    // Check for logged-in user
    const user = JSON.parse(localStorage.getItem('user'));
    const loginBtn = document.getElementById('loginBtn');
    
    if(user && loginBtn) {
        // Formats name to uppercase as seen in your target image
        loginBtn.innerText = `HI, ${user.username.toUpperCase()}`;
        loginBtn.onclick = () => {
            if(confirm("Logout?")) {
                localStorage.removeItem('user');
                window.location.reload();
            }
        };
    }

    if(document.getElementById('propertyGrid')) loadProperties();
});

async function loadProperties() {
    const grid = document.getElementById('propertyGrid');
    const search = document.getElementById('searchInput').value;
    const type = document.getElementById('searchType').value;

    grid.innerHTML = '<p>Searching exclusive collection...</p>';

    try {
        const res = await fetch(`${API_URL}/properties?search=${search}&type=${type}`);
        const data = await res.json();
        grid.innerHTML = '';

        if(data.length === 0) {
            grid.innerHTML = "<h3>No properties found.</h3>";
            return;
        }

        data.forEach(p => {
            const card = document.createElement('div');
            card.className = 'property-card';
            card.innerHTML = `
                <div class="card-media">
                    <img src="${p.image}" alt="${p.title}">
                    <div class="status-tag">FOR SALE</div>
                </div>
                <div class="card-body">
                    <h3 class="prop-name">${p.title}</h3>
                    <div class="prop-price">$${p.price.toLocaleString()}</div>
                    <div class="prop-location">
                        <i class="fa-solid fa-location-dot"></i> ${p.city}
                    </div>
                    <button class="view-btn" onclick="window.location.href='details.html?id=${p._id}'">
                        View Details
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (e) {
        grid.innerHTML = '<p>Error: Ensure MongoDB and server.js are running.</p>';
    }
}
async function login() {
    // 1. Get values from the modal input fields
    const name = document.getElementById('username').value;
    const email = document.getElementById('userEmail').value;
    const phone = document.getElementById('userPhone').value;

    // 2. Simple validation to ensure fields aren't empty
    if (!name || !email || !phone) {
        return alert("Please fill in all details to continue.");
    }

    // 3. Save user data to LocalStorage (so it persists after refresh)
    const userData = {
        username: name,
        email: email,
        phone: phone
    };
    localStorage.setItem('user', JSON.stringify(userData));

    // 4. Close the modal immediately
    document.getElementById('loginModal').style.display = 'none';

    // 5. Update the Navbar button to show your name (matches your goal image)
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.innerText = `HI, ${name.toUpperCase()}`;
    }

    alert(`Welcome, ${name}! You can now view exclusive listings.`);
    
    // Optional: Reload to ensure all components recognize the new user state
    window.location.reload();
}