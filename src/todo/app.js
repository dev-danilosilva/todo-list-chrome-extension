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

// ----> Task List Functions
function createNewTaskElement(
    taskText='',
    options={
        deleteButtonClickEvent: (e, TaskEl) => console.log('Task Removed'),
        completeButtonClickEvent: (e, TaskEl) => console.log('Task Done')
    }
) {
    const taskDiv = createElement('div', {'class': 'task'});
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
    taskEl.remove();
}

function completeTask(e, taskEl){
    taskEl.classList.toggle('completed');
}

function saveTask(task) {
    insertIntoLocalStorageArray(localStorageKey, task);
}

//----> DOM EVENT FUNCTIONS
function addTask(e){
    e.preventDefault();
    const taskText = taskInput.value
    if (taskText) {
        taskList.appendChild(createNewTaskElement(taskText, {
            deleteButtonClickEvent: deleteTask,
            completeButtonClickEvent: completeTask
        }));
        saveTask(taskText);
        taskInput.value = '';
    }

}

function loadTasks(e){
    let tasks = []
    ls = localStorage.getItem(localStorageKey)
    if (ls) tasks = JSON.parse(ls);

    tasks.forEach( (task) => taskList.appendChild(createNewTaskElement(task, {
                                                        deleteButtonClickEvent: deleteTask,
                                                        completeButtonClickEvent: completeTask
                                                    })))
}


// -----> Event Listener Bindings
addTaskButton.addEventListener('click', addTask);
document.addEventListener('DOMContentLoaded', loadTasks)