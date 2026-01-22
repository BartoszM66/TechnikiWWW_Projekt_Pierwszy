document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    initMobileMenu();

    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

function updateNavigation() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const user = JSON.parse(localStorage.getItem('user'));

    const existingUserMenu = document.querySelector('.user-menu-container');
    const existingLoginBtn = document.querySelector('.login-li');
    const existingAdminLinks = document.querySelectorAll('.admin-simple-link');

    if (existingUserMenu) existingUserMenu.remove();
    if (existingLoginBtn) existingLoginBtn.remove();
    if (existingAdminLinks) existingAdminLinks.forEach(el => el.remove());

    if (user) {
        if (user.role === 'admin') {
            const adminLi = document.createElement('li');
            adminLi.className = 'admin-simple-link';

            adminLi.innerHTML = `
                <a href="admin_panel.html" style="color: var(--accent); font-weight: bold; border: 1px solid var(--accent); padding: 8px 15px; border-radius: 4px;">
                    PANEL ADMINA
                </a>
            `;
            navLinks.appendChild(adminLi);

            const logoutLi = document.createElement('li');
            logoutLi.className = 'admin-simple-link';
            logoutLi.innerHTML = `<a href="#" id="logoutBtn">Wyloguj</a>`;
            navLinks.appendChild(logoutLi);

            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
            return;
        }

        const firstName = user.name.split(' ')[0];
        const userLi = document.createElement('li');
        userLi.className = 'user-menu-container';

        userLi.innerHTML = `
            <div class="user-name-btn">Cześć, ${firstName}</div>
            <div class="user-dropdown">
                <ul>
                    <li><a href="booking.html">Zapis na usługi</a></li>
                    <li><a href="history.html">Historia usług</a></li>
                    <li><a href="#" id="logoutBtn" style="border-top: 1px solid #333;">Wyloguj się</a></li>
                </ul>
            </div>
        `;
        navLinks.appendChild(userLi);

        const nameBtn = userLi.querySelector('.user-name-btn');
        nameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userLi.classList.toggle('active');
        });
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
        document.addEventListener('click', () => userLi.classList.remove('active'));

    } else {
        const loginLi = document.createElement('li');
        loginLi.className = 'login-li';
        loginLi.innerHTML = `<a href="login.html" class="btn-login">Zaloguj się</a>`;
        navLinks.appendChild(loginLi);
    }
}

window.showPopup = (message, type = 'success') => {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';

        const box = document.createElement('div');
        box.className = `popup-box ${type}`;

        const msg = document.createElement('p');
        msg.className = 'popup-message';
        msg.innerHTML = message.replace(/\n/g, '<br>');

        const btnDiv = document.createElement('div');
        btnDiv.className = 'popup-buttons';

        const btnOk = document.createElement('button');
        btnOk.className = type === 'error' ? 'btn-popup danger' : 'btn-popup primary';
        btnOk.textContent = 'OK';

        const close = () => {
            overlay.remove();
            resolve();
        };

        btnOk.onclick = close;
        window.addEventListener('keydown', function handler(e) {
            if(e.key === 'Enter') {
                window.removeEventListener('keydown', handler);
                close();
            }
        });

        btnDiv.appendChild(btnOk);
        box.appendChild(msg);
        box.appendChild(btnDiv);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        btnOk.focus();
    });
};

window.confirmPopup = (message) => {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';

        const box = document.createElement('div');
        box.className = 'popup-box';

        const msg = document.createElement('p');
        msg.className = 'popup-message';
        msg.innerHTML = message.replace(/\n/g, '<br>');

        const btnDiv = document.createElement('div');
        btnDiv.className = 'popup-buttons';

        const btnYes = document.createElement('button');
        btnYes.className = 'btn-popup primary';
        btnYes.textContent = 'TAK';

        const btnNo = document.createElement('button');
        btnNo.className = 'btn-popup secondary';
        btnNo.textContent = 'NIE';

        const close = (result) => {
            overlay.remove();
            resolve(result);
        };

        btnYes.onclick = () => close(true);
        btnNo.onclick = () => close(false);

        btnDiv.appendChild(btnNo);
        btnDiv.appendChild(btnYes);
        box.appendChild(msg);
        box.appendChild(btnDiv);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        btnYes.focus();
    });
};

window.logout = async () => {
    try {
        await showPopup("Wylogowano pomyślnie.\nDo zobaczenia!", "success");
    } catch (e) {
        console.error(e);
    } finally {
        localStorage.removeItem('user');
        window.location.replace('index.html');
    }
};