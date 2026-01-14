// Основний JavaScript для ElyBox.pro
document.addEventListener('DOMContentLoaded', function () {
    // Мобільне меню
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });
    }

    // Закрити меню при кліку на посилання
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // Фільтрація галереї
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                // Видалити активний клас у всіх кнопок
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Додати активний клас до поточної кнопки
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                // Фільтрація елементів галереї
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Оновлення онлайн гравців
    updateOnlinePlayers();

    // Оновлювати кожні 30 секунд
    setInterval(updateOnlinePlayers, 30000);

    // Симуляція активної гравців
    simulatePlayerActivity();
});

// Функція для оновлення кількості онлайн гравців
function updateOnlinePlayers() {
    const onlineElement = document.getElementById('onlineCount');
    if (!onlineElement) return;

    // Симуляція реальних даних (можна замінити на реальний запит до API)
    const baseOnline = 15;
    const randomFactor = Math.floor(Math.random() * 20);
    const totalOnline = baseOnline + randomFactor;

    onlineElement.textContent = ${ totalOnline } гравців онлайн;
    onlineElement.style.color = totalOnline > 20 ? '#2ecc71' : '#f39c12';
}

// Функція для копіювання IP адреси
function copyIP() {
    const ipElement = document.getElementById('ipAddress');
    if (!ipElement) return;

    const ip = ipElement.textContent;

    // Використовуємо сучасний Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(ip).then(() => {
            showNotification('IP адресу скопійовано!');
        }).catch(err => {
            // Запасний варіант
            fallbackCopyText(ip);
        });
    } else {
        // Запасний варіант для старих браузерів
        fallbackCopyText(ip);
    }
}
// Запасний метод копіювання
function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showNotification('IP адресу скопійовано!');
    } catch (err) {
        showNotification('Не вдалося скопіювати. Спробуйте вручну.');
    }

    document.body.removeChild(textArea);
}

// Функція для показу сповіщень
function showNotification(message) {
    let notification = document.getElementById('notification');

    if (!notification) {
        // Створити сповіщення, якщо його немає
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.style.display = 'block';

    // Автоматичне приховування через 3 секунди
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Симуляція активної гравців (для демонстрації)
function simulatePlayerActivity() {
    const players = [
        "Степан_Шахтар", "Майстер_Будівник", "Аліна_Чарівниця",
        "КозацькийДух", "Влад_Мінерал", "Софія_Фермер",
        "Артем_Мандрівник", "Назар_Воїн", "Юля_Алхімік"
    ];

    const activityElement = document.getElementById('playerActivity');
    if (!activityElement) return;

