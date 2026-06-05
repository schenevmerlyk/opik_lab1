function showMessage(msg, type) {
    const msgDiv = document.getElementById('message');
    if (msgDiv) {
        msgDiv.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
    }
}

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const gender = document.getElementById('gender').value;
    const dob = document.getElementById('dob').value;
    const password = document.getElementById('password').value;

    if (!name || !email || !gender || !dob || !password) {
        showMessage('Заповніть всі поля', 'danger');
        return;
    }

    try {
        // Перевірка чи email вже існує
        const checkRes = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
        const existing = await checkRes.json();
        if (existing.length > 0) {
            showMessage('Користувач з таким email вже існує', 'danger');
            return;
        }

        // Реєстрація
        const newUser = { name, email, gender, dob, password };
        const res = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        if (!res.ok) throw new Error('Помилка реєстрації');
        const user = await res.json();
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        showMessage('Реєстрація успішна! Перенаправлення...', 'success');
        setTimeout(() => window.location.href = 'todo.html', 1500);
    } catch (err) {
        showMessage(err.message, 'danger');
    }
});