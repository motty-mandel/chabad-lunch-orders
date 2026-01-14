const yomTov = document.querySelector('.yom-tov');
const info = document.querySelector('.info');
const mainContainer = document.querySelector('.main-container');

function ordersState() {
    const openClosed = localStorage.getItem('ordersState');

    if (openClosed === 'closed') {
        yomTov.style.display = 'block';
        info.style.display = 'none';
        mainContainer.style.display = 'none';
    } else {
        yomTov.style.display = 'none';
        info.style.display = 'flex';
        mainContainer.style.display = 'block';
    }
};

document.addEventListener('DOMContentLoaded', ordersState);