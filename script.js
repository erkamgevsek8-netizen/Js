// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskCount = document.getElementById('taskCount');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearAllBtn = document.getElementById('clearAllBtn');

// State
let tasks = [];
let currentFilter = 'all';

// LocalStorage Keys
const STORAGE_KEY = 'todoTasks';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTasks();
        });
    });
    
    clearAllBtn.addEventListener('click', clearAllTasks);
}

// Add Task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Lütfen bir görev yazın!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleString('tr-TR')
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

// Delete Task
function deleteTask(id) {
    if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
}

// Toggle Task Completion
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

// Clear All Tasks
function clearAllTasks() {
    if (confirm('Tüm görevleri silmek istediğinizden emin misiniz?')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

// Render Tasks
function renderTasks() {
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    // Update Task Count
    const activeTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = activeTasks;
    
    // Show/Hide Empty State
    if (filteredTasks.length === 0) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
    }
    
    // Show/Hide Clear All Button
    if (tasks.length > 0) {
        clearAllBtn.classList.add('show');
    } else {
        clearAllBtn.classList.remove('show');
    }
    
    // Render Task Items
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <div class="task-text">
                <strong>${escapeHtml(task.text)}</strong>
                <div style="font-size: 0.8em; color: #999; margin-top: 5px;">
                    ${task.createdAt}
                </div>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️ Sil</button>
        `;
        taskList.appendChild(li);
    });
}

// Save Tasks to LocalStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Load Tasks from LocalStorage
function loadTasks() {
    const saved = localStorage.getItem(STORAGE_KEY);
    tasks = saved ? JSON.parse(saved) : [];
}

// Escape HTML (Security)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Console Log for Debugging
console.log('🚀 To-Do List App başlatıldı!');
console.log('💾 Görevler LocalStorage\'da kaydediliyor');