let currentDate = new Date();

function getWeekMondayAndFriday(baseDate) {
    const day = baseDate.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + diffToMonday);

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const formatDate = (date) =>
        (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
        date.getDate().toString().padStart(2, '0');

    return `${formatDate(monday)} - ${formatDate(friday)}`;
}

function updateDisplay() {
    document.getElementById('weekRange').textContent = getWeekMondayAndFriday(currentDate);
}

updateDisplay();
// -------------------------------------------------------------------
let total = document.getElementById('total');
let totalPrice = 0;
let totalItems = [];

fetch('./menu.json')
    .then(response => response.json())
    .then(data => {
        data.menuItems.forEach(item => {
            const block = document.createElement('div');
            block.className = 'monday';

            block.innerHTML = `
                <label for="orders" id="day">${item.day}:</label>
                <button class="minus">&minus;</button>
                <input type="text" name="orders" id="orders" placeholder="0">
                <button class="plus">&plus;</button>
                <h5 id="menu">${item.foodItems}</h5>
            `;

            const minusBtn = block.querySelector('.minus');
            const plusBtn = block.querySelector('.plus');
            const input = block.querySelector('input');

            minusBtn.addEventListener('click', () => {
                let current = parseInt(input.value) || 0;
                if (current > 0) {
                    input.value = current - 1;
                    totalPrice -= 8;

                    let existing = totalItems.find(x => x.id === item.id);
                    if (existing) {
                        existing.qty--;
                        if (existing.qty <= 0) {
                            totalItems = totalItems.filter(x => x.id !== item.id);
                        }
                    }

                    updateTotal();
                }
            });

            plusBtn.addEventListener('click', () => {
                let current = parseInt(input.value) || 0;
                input.value = current + 1;
                totalPrice += 8;

                let existing = totalItems.find(x => x.id === item.id);
                if (existing) {
                    existing.qty++;
                } else {
                    totalItems.push({
                        id: item.id,
                        name: item.foodItems,
                        day: item.day,
                        qty: 1
                    });
                }

                updateTotal();
            });

            days.appendChild(block);
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));

let itemsText = "";

function updateTotal() {
    itemsText = totalItems.map(item => `For ${item.day}: ${item.name} (x${item.qty})`).join(', ');
    total.textContent = `Total: $${totalPrice}`;
    console.log(itemsText)
}

const orderBtn = document.querySelector('.order-btn');

orderBtn.addEventListener('click', () => {
    if (totalItems.length === 0) {
        alert("Please add at least one item!");
        return;
    }

    fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: totalItems })
    })
        .then(res => res.json())
        .then(data => {
            window.location.href = data.url; // Redirect to Stripe Checkout
        })
        .catch(err => console.error("Error:", err));
});

// -----------------------------------
// const orderBtn = document.querySelector('.order-btn');
// const customerName = document.getElementById('name');
// const customerEmail = document.getElementById('email');
// const requests = document.getElementById('requests');

// orderBtn.addEventListener('click', () => {
//     if (customerName.value === "" || customerEmail.value === "") {
//         alert("Make sure name and email are filled out!")
//     } else
//         if (requests.value !== "") {
//         emailjs.send("service_bgkimz8", "template_j0k8d1e", {
//             customer_name: customerName.value,
//             customer_email: customerEmail.value,
//             order_details: itemsText,
//             special_requests: requests.value
//         })
//             .then((response) => {
//                 alert("Order sent successfully!");
//             }, (error) => {
//                 alert("Failed to send order.", error);
//             });
//     } else {
//         emailjs.send("service_bgkimz8", "template_j0k8d1e", {
//             customer_name: customerName.value,
//             order_details: itemsText
//         })
//             .then((response) => {
//                 alert("Order sent successfully!");
//             }, (error) => {
//                 alert("Failed to send order.", error);
//             });
//     }
// })