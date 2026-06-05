const API_BASE = 'http://localhost:3000';

// === Користувачі ===
async function registerUser(userData) {
    const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Помилка реєстрації');
    return res.json();
}

async function loginUser(email, password) {
    const res = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`);
    const users = await res.json();
    const user = users.find(u => u.password === password);
    if (!user) throw new Error('Невірний email або пароль');
    return user;
}

// === Завдання (прив'язані до userId) ===
async function fetchTodos(userId) {
    const res = await fetch(`${API_BASE}/todos?userId=${userId}`);
    if (!res.ok) throw new Error('Не вдалося завантажити завдання');
    return res.json();
}

async function createTodo(userId, title, description) {
    const newTodo = {
        userId,
        title,
        description,
        completed: false
    };
    const res = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
    });
    if (!res.ok) throw new Error('Помилка створення завдання');
    return res.json();
}

async function updateTodo(id, updates) {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Помилка оновлення');
    return res.json();
}

async function deleteTodo(id) {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Помилка видалення');
}