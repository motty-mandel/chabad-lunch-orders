const closeOrdersBtn = document.querySelector('.close-orders-btn');
const openOrdersBtn = document.querySelector('.open-orders-btn');
const manageMenu = document.querySelector('.menu');

function closeOrders() {
    closeOrdersBtn.classList.add('active');
    openOrdersBtn.classList.remove('active');
    localStorage.setItem('ordersState', 'closed');
}

function openOrders() {
    closeOrdersBtn.classList.remove('active');
    openOrdersBtn.classList.add('active');
    localStorage.setItem('ordersState', 'open');
}

// Restore button state on page load
function restoreButtonState() {
    const state = localStorage.getItem('ordersState');
    if (state === 'closed') {
        closeOrders();
    } else if (state === 'open') {
        openOrders();
    }
}


fetch('./menu.json')
    .then(response => response.json())
    .then(data => {
        manageMenu.innerHTML = data.menuItems.map(item => `
            <div class="menu-item">
                <h3>${item.day}</h3>
                <p contenteditable="true" data-id="${item.id}" class="editable-food">${item.foodItems}</p>
                <button class="save-btn" data-id="${item.id}">Save</button>
            </div>
        `).join('');
        
        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', saveFoodItems);
        });
    });

function saveFoodItems(e) {
    const itemId = e.target.dataset.id;
    const foodText = document.querySelector(`.editable-food[data-id="${itemId}"]`).innerText;
    
    fetch('http://localhost:4242/update-menu.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, foodItems: foodText })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) alert('Saved!');
        else alert('Error saving');
    })
    .catch(err => console.error(err));
}

// Run on page load
document.addEventListener('DOMContentLoaded', restoreButtonState);