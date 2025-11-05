// Simple drag & drop to-do list with localStorage
(function(){
  const SELECTORS = {
    input: '#task-input',
    addBtn: '#add-btn',
    todoList: '#todo-list',
    doneList: '#done-list',
    clearBtn: '#clear-btn'
  };

  const storageKey = 'simple-dd-tasks-v1';

  let tasks = { todo: [], done: [] };

  function $(s){return document.querySelector(s)}

  function save(){
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }

  function load(){
    const raw = localStorage.getItem(storageKey);
    if(raw) {
      try{ tasks = JSON.parse(raw) }catch(e){ tasks = { todo:[], done:[] } }
    }
  }

  function createTaskEl(task){
    const el = document.createElement('div');
    el.className = 'task';
    el.draggable = true;
    el.dataset.id = task.id;

    el.innerHTML = `
      <div class="left">
        <span class="title">${escapeHtml(task.title)}</span>
      </div>
      <div class="actions">
        <button class="icon-btn" data-action="edit" title="Edit">✏️</button>
        <button class="icon-btn" data-action="delete" title="Delete">🗑️</button>
      </div>
    `;

    // drag events
    el.addEventListener('dragstart', e=>{
      e.dataTransfer.setData('text/plain', task.id);
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', ()=> el.classList.remove('dragging'));

    // actions
    el.querySelector('[data-action="delete"]').addEventListener('click', ()=>{
      removeTask(task.id);
    });

    el.querySelector('[data-action="edit"]').addEventListener('click', ()=>{
      const newTitle = prompt('Edit task', task.title);
      if(newTitle!=null){ updateTaskTitle(task.id, newTitle.trim()) }
    });

    return el;
  }

  function escapeHtml(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function render(){
    const todo = $(SELECTORS.todoList);
    const done = $(SELECTORS.doneList);
    todo.innerHTML = '';
    done.innerHTML = '';

    tasks.todo.forEach(t=> todo.appendChild(createTaskEl(t)));
    tasks.done.forEach(t=> done.appendChild(createTaskEl(t)));
  }

  function addTask(title){
    if(!title) return;
    const task = { id: Date.now().toString(), title };
    tasks.todo.unshift(task);
    save(); render();
  }

  function removeTask(id){
    ['todo','done'].forEach(list=>{
      tasks[list] = tasks[list].filter(t=>t.id!==id);
    });
    save(); render();
  }

  function updateTaskTitle(id, title){
    if(!title) return;
    ['todo','done'].forEach(list=>{
      tasks[list] = tasks[list].map(t=> t.id===id ? {...t,title} : t);
    });
    save(); render();
  }

  function findAndRemoveFromAll(id){
    for(const listName of ['todo','done']){
      const idx = tasks[listName].findIndex(t=>t.id===id);
      if(idx!==-1){
        const [item] = tasks[listName].splice(idx,1);
        return item;
      }
    }
    return null;
  }

  // dropzone helpers
  function setupDropzone(el, listName){
    el.addEventListener('dragover', e=>{
      e.preventDefault();
      el.classList.add('dragover');
    });
    el.addEventListener('dragleave', ()=> el.classList.remove('dragover'));
    el.addEventListener('drop', e=>{
      e.preventDefault();
      el.classList.remove('dragover');
      const id = e.dataTransfer.getData('text/plain');
      if(!id) return;
      const item = findAndRemoveFromAll(id);
      if(item){
        tasks[listName].unshift(item);
        save(); render();
      }
    });
  }

  function clearAll(){
    if(confirm('Clear all tasks?')){
      tasks = { todo: [], done: [] };
      save(); render();
    }
  }

  function init(){
    load();
    render();

    const input = $(SELECTORS.input);
    const addBtn = $(SELECTORS.addBtn);
    const clearBtn = $(SELECTORS.clearBtn);

    addBtn.addEventListener('click', ()=>{
      const v = input.value.trim();
      if(!v) return; addTask(v); input.value = '';
    });

    input.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); addBtn.click() } });

    setupDropzone($(SELECTORS.todoList),'todo');
    setupDropzone($(SELECTORS.doneList),'done');

    clearBtn.addEventListener('click', clearAll);
  }

  // bootstrap
  document.addEventListener('DOMContentLoaded', init);

})();
