function checkAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    const path = window.location.pathname;
    const isAuthPage = path.includes('login.html') || path.includes('register.html');

    if (!currentUser && !isAuthPage) {
        window.location.href = 'login.html';   // редірект на логін, якщо не залогінений
    }
    if (currentUser && isAuthPage) {
        window.location.href = 'todo.html';    // редірект на todo, якщо вже залогінений
    }
}

function updateNavbar() {
    const currentUser = sessionStorage.getItem('currentUser');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const profileLink = document.getElementById('profileLink');
    const logoutBtn = document.getElementById('logoutBtn');
    if (!loginLink) return;

    if (currentUser) {
        loginLink?.parentElement?.classList.add('d-none');
        registerLink?.parentElement?.classList.add('d-none');
        profileLink?.parentElement?.classList.remove('d-none');
        logoutBtn?.classList.remove('d-none');
    } else {
        loginLink?.parentElement?.classList.remove('d-none');
        registerLink?.parentElement?.classList.remove('d-none');
        profileLink?.parentElement?.classList.add('d-none');
        logoutBtn?.classList.add('d-none');
    }
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function loadNavbar() {
    if (document.querySelector('.navbar')) return;
    const navbarHtml = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="todo.html">📋 To-Do List</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item"><a class="nav-link" href="todo.html">Робоча сторінка</a></li>
                    <li class="nav-item"><a class="nav-link" href="about.html">Про додаток</a></li>
                    <li class="nav-item" id="profileNavItem"><a class="nav-link" href="profile.html">Профіль</a></li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item" id="loginNavItem"><a class="nav-link" href="login.html">Вхід</a></li>
                    <li class="nav-item" id="registerNavItem"><a class="nav-link" href="register.html">Реєстрація</a></li>
                    <li class="nav-item" id="logoutNavItem"><button class="btn btn-outline-light" onclick="logout()">Вийти</button></li>
                </ul>
            </div>
        </div>
    </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', navbarHtml);
    updateNavbar();
}

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    checkAuth();
});