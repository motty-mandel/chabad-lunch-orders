let currentDate = new Date(); // Tracks which week we're on

function getWeekMondayAndFriday(baseDate) {
    const day = baseDate.getDay(); // Sunday=0, Monday=1
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

// // Button events
// document.getElementById('prevWeek').addEventListener('click', () => {
//     currentDate.setDate(currentDate.getDate() - 7);
//     updateDisplay();
// });
// document.getElementById('nextWeek').addEventListener('click', () => {
//     currentDate.setDate(currentDate.getDate() + 7);
//     updateDisplay();
// });

// Initial display
updateDisplay();
// -------------------------------------------------------------------
let total = document.getElementById('total');
let totalPrice = 0;

// 

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
                    updateTotal();
                }
            });

            plusBtn.addEventListener('click', () => {
                let current = parseInt(input.value) || 0;
                input.value = current + 1;
                totalPrice += 8;
                updateTotal();
            });

            days.appendChild(block);
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));

    function updateTotal() {
        total.textContent = `Total: $${totalPrice}`
    }