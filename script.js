const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const voiceBtn = document.getElementById('voiceBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskCount = document.getElementById('taskCount');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearAllBtn = document.getElementById('clearAllBtn');

let tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
let currentFilter = 'all';

// Sesli Komut Hazırlığı
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    voiceBtn.addEventListener('click', () => recognition.start());
    recognition.onresult = (e) => {
        taskInput.value = e.results[0][0].transcript;
        addTask();
    };
} else {
    voiceBtn.style.display = 'none';
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    tasks.push({ id: Date.now(), text, completed: false, createdAt: new Date().toLocaleString('tr-TR') });
    saveAndRender();
    taskInput.value = '';
}

function saveAndRender() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    const filtered = tasks.filter(t => currentFilter === 'all' ? true : (currentFilter === 'active' ? !t.completed : t.completed));
    
    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <div class="task-text">${task.text}</div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Sil</button>
        `;
        taskList.appendChild(li);
    });
    
    taskCount.textContent = tasks.filter(t => !t.completed).length;
    emptyState.style.display = tasks.length === 0 ? 'block' : 'none';
    clearAllBtn.style.display = tasks.length > 0 ? 'block' : 'none';
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

addBtn.addEventListener('click', addTask);
clearAllBtn.addEventListener('click', () => { tasks = []; saveAndRender(); });
renderTasks();
