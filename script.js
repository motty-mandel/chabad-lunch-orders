let currentDate = new Date();
const currentDay = currentDate.toLocaleString('en-US', { weekday: 'long' });
const currentTimeHours = currentDate.getHours();
// console.log(currentTimeHours)

const daysMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
};

let currentDayNum = daysMap[currentDay];


// function getWeekMondayAndFriday(baseDate) {
//     const day = baseDate.getDay();
//     const diffToMonday = (day === 0 ? -6 : 1) - day;
//     const monday = new Date(baseDate);
//     monday.setDate(baseDate.getDate() + diffToMonday);

//     const friday = new Date(monday);
//     friday.setDate(monday.getDate() + 4);

//     const formatDate = (date) =>
//         (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
//         date.getDate().toString().padStart(2, '0');

//     return `${formatDate(monday)} - ${formatDate(friday)}`;
// }

// function updateDisplay() {
//     document.getElementById('weekRange').textContent = getWeekMondayAndFriday(currentDate);
// }

// updateDisplay();

// function formatAMPM(date) {
//     var hours = date.getHours();
//     var minutes = date.getMinutes();
//     var ampm = hours >= 12 ? 'pm' : 'am';
//     hours = hours % 12;
//     hours = hours ? hours : 12;
//     minutes = minutes < 10 ? '0' + minutes : minutes;
//     var strTime = hours + ':' + minutes + ' ' + ampm;
//     return strTime;
// }





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
                <div class="data">
                    <label for="orders" id="day">${item.day}:</label>
                    <h5 id="menu">${item.foodItems}</h5>
                </div>
                <button class="minus">&minus;</button>
                <input type="text" name="orders" id="orders" placeholder="0">
                <button class="plus">&plus;</button>
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
}
// -------------------------------------------------------

document.querySelector('.order-btn').addEventListener('click', () => {
    if (totalItems.length === 0) {
        alert("Please add at least one item!");
        return;
    }

    // if (8 < currentTimeHours < 16) {
    //     alert("Orders are closed at this time!");
    //     return;
    // }

    const conflict = totalItems.some(order => {
        let orderDayNum = daysMap[order.day.trim()];
        return orderDayNum < currentDayNum;
    });

    if (conflict) {
        alert("At least one of the orders is for a day that's already gone!");
        return;
    }

    const specialRequests = document.getElementById('requests').value.trim();

    fetch('https://chabad-lunch-orders.onrender.com/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: totalItems, specialRequests })
    })
        .then(res => res.json())
        .then(data => {
            window.location.href = data.url;
        })
        .catch(err => console.error("Error:", err));
});