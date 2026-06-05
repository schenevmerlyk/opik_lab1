document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    if (messageDiv) messageDiv.innerHTML = '';

    try {
        const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error('Помилка сервера');

        const users = await res.json();
        const user = users.find(u => u.password === password);

        if (!user) {
            if (messageDiv) {
                messageDiv.innerHTML = '<div class="alert alert-danger">Невірний email або пароль</div>';
            }
            return;
        }

        sessionStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'todo.html';
    } catch (err) {
        console.error(err);
        if (messageDiv) {
            messageDiv.innerHTML = '<div class="alert alert-danger">Помилка з\'єднання з сервером. Запустіть json-server.</div>';
        }
    }
});