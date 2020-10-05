const taskList = document.querySelector('.task-list');
const taskInput = document.querySelector('.task-input');
const addTaskButton = document.querySelector('.add-task-button');
const localStorageKey = '_tasks_chrome_extension_data_';

// -----> Helper Functions

function createElement(elementName, attributes={}){
    const el = document.createElement(elementName);

    if (attributes) {
        for (let attr in attributes){
            el.setAttribute(attr, attributes[attr]);
        }
    }

    return el;
}

function createIcon(faClasses){
    const i = createElement('i');
    for(let x of faClasses.split(' ')){
        i.classList.add(x);
    }
    return i;
}

function insertText(elem, text){
    elem.innerText = text;
}

function insertIntoLocalStorageArray(key, value){
    let values = [];
    if (localStorage.getItem(key)) values = JSON.parse(localStorage.getItem(key));
    values.push(value);
    localStorage.setItem(key, JSON.stringify(values));
    return values;
}

function deleteFromLocalStorageArray(key, index){
    let values = [];
    if (localStorage.getItem(key)) values = JSON.parse(localStorage.getItem(key));
    if (values) {
        values.splice(index, 1);
        localStorage.setItem(key, JSON.stringify(values));
    }
}


// ----> Task List Functions
function createNewTaskElement(
    taskText='',
    options={
        uniqueId: undefined,
        deleteButtonClickEvent: (e, TaskEl) => console.log('Task Removed'),
        completeButtonClickEvent: (e, TaskEl) => console.log('Task Done')
    }
) {
    const taskDiv = createElement('div', {'class': 'task', taskId: options.uniqueId});
    const newTask = createElement('li', {'class': 'task-item'});
    const completeTaskButton = createElement('button', {'class': 'complete-task-button'});
    const deleteTaskButton = createElement('button', {'class': 'delete-task-button'});

    taskDiv.appendChild(newTask);

    completeTaskButton.appendChild(
        createIcon('fa fa-check')
    );
    deleteTaskButton.appendChild(
        createIcon('fa fa-trash')
    );

    taskDiv.appendChild(completeTaskButton);
    taskDiv.appendChild(deleteTaskButton);

    if (options.deleteButtonClickEvent) deleteTaskButton.addEventListener('click', (e) => options.deleteButtonClickEvent(e, taskDiv));

    if (options.completeButtonClickEvent) completeTaskButton.addEventListener('click', (e) => options.completeButtonClickEvent(e, taskDiv));


    insertText(newTask, taskText);

    return taskDiv;
}

function deleteTask(e, taskEl){
    updateTaskStatus(taskEl.getAttribute('taskid'), null ,localStorageKey);
    taskEl.remove();
}

function completeTask(e, taskEl){
    taskEl.classList.toggle('completed');
    updateTaskStatus(taskEl.getAttribute('taskid'), taskEl.classList.contains('completed') ,localStorageKey);
}

function saveTask(task) {
    insertIntoLocalStorageArray(localStorageKey, task);
}

function updateTaskStatus(id, status, localStorageKey){
    let values = [];
    values = JSON.parse(localStorage.getItem(localStorageKey));
    for (let i = 0; i < values.length; ++i){
        if (values[i].id == parseInt(id)) {
            if (status == null) values.splice(i, 1);
            else values[i].done = status;
            break;
        }
    }
    localStorage.setItem(localStorageKey, JSON.stringify(values));
    return values;
}


//----> DOM EVENT FUNCTIONS
function addTask(e){
    e.preventDefault();
    const taskText = taskInput.value
    const taskId = Date.now()
    if (taskText) {
        taskList.appendChild(createNewTaskElement(taskText, {
            deleteButtonClickEvent: deleteTask,
            completeButtonClickEvent: completeTask,
            uniqueId: taskId
        }));
        saveTask({text: taskText, id: taskId, done: false});
        taskInput.value = '';
    }

}

function loadTasks(e){
    let tasks = [];
    ls = localStorage.getItem(localStorageKey);
    if (ls) tasks = JSON.parse(ls);

    tasks.forEach( task => {
        const el = createNewTaskElement(task.text, {
            deleteButtonClickEvent: deleteTask,
            completeButtonClickEvent: completeTask,
            uniqueId: task.id
        });

        if (task.done) el.classList.add('completed')

        taskList.appendChild(el);


    } )
}


// -----> Event Listener Bindings
addTaskButton.addEventListener('click', addTask);
document.addEventListener('DOMContentLoaded', loadTasks)