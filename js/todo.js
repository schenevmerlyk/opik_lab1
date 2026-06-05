let currentUser = null;
let todos = [];

async function loadUser() {
    const userStr = sessionStorage.getItem('currentUser');
    if (!userStr) {
        window.location.href = 'login.html';
        return;
    }
    currentUser = JSON.parse(userStr);
    await loadTodos();
}

async function loadTodos() {
    try {
        const res = await fetch(`http://localhost:3000/todos?userId=${currentUser.id}`);
        if (!res.ok) throw new Error('HTTP помилка');
        todos = await res.json();
        renderTasks();
    } catch (err) {
        console.error(err);
        document.getElementById('tasksList').innerHTML = '<div class="alert alert-danger">Помилка завантаження завдань. Переконайтеся, що сервер запущено (npm run server).</div>';
    }
}

function renderTasks() {
    const container = document.getElementById('tasksList');
    if (!container) return;
    if (todos.length === 0) {
        container.innerHTML = '<div class="alert alert-info">Завдань поки немає. Додайте перше!</div>';
        return;
    }
    let html = '<div class="list-group">';
    todos.forEach(task => {
        html += `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div class="flex-grow-1">
                    <input type="checkbox" class="form-check-input me-2" ${task.completed ? 'checked' : ''} onclick="toggleComplete('${task.id}')">
                    <strong class="${task.completed ? 'text-decoration-line-through' : ''}">${escapeHtml(task.title)}</strong>
                    <small class="d-block text-muted">${escapeHtml(task.description || '')}</small>
                </div>
                <div>
                    <button class="btn btn-sm btn-warning me-1" onclick="editTask('${task.id}')">✏️</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTask('${task.id}')">🗑️</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

async function saveTask() {
    const id = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDesc').value.trim();

    if (!title) {
        alert('Введіть назву завдання');
        return;
    }

    try {
        if (id) {
            // оновлення
            const oldTask = todos.find(t => t.id == id);
            if (oldTask) {
                const updated = { ...oldTask, title, description };
                const res = await fetch(`http://localhost:3000/todos/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated)
                });
                if (!res.ok) throw new Error('Помилка оновлення');
            }
        } else {
            // створення
            const newTodo = {
                userId: currentUser.id,
                title,
                description,
                completed: false
            };
            const res = await fetch('http://localhost:3000/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodo)
            });
            if (!res.ok) throw new Error('Помилка створення');
        }
        await loadTodos();
        bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
    } catch (err) {
        alert('Помилка: ' + err.message);
    }
}

async function deleteTask(id) {
    if (confirm('Видалити завдання?')) {
        try {
            const res = await fetch(`http://localhost:3000/todos/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Помилка видалення');
            await loadTodos();
        } catch (err) {
            alert('Помилка видалення: ' + err.message);
        }
    }
}

async function toggleComplete(id) {
    const task = todos.find(t => t.id == id);
    if (task) {
        try {
            const updated = { ...task, completed: !task.completed };
            const res = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
            if (!res.ok) throw new Error('Помилка оновлення');
            await loadTodos();
        } catch (err) {
            alert('Помилка: ' + err.message);
        }
    }
}

function editTask(id) {
    const task = todos.find(t => t.id == id);
    if (task) {
        document.getElementById('taskId').value = task.id;
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDesc').value = task.description || '';
        document.getElementById('modalTitle').innerText = 'Редагувати завдання';
        new bootstrap.Modal(document.getElementById('taskModal')).show();
    }
}

function openModal() {
    document.getElementById('taskId').value = '';
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDesc').value = '';
    document.getElementById('modalTitle').innerText = 'Нове завдання';
}

// Глобальні функції для HTML-кнопок
window.openModal = openModal;
window.saveTask = saveTask;
window.editTask = editTask;
window.deleteTask = deleteTask;
window.toggleComplete = toggleComplete;

// Запуск після завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
});