class Task{
    constructor(id, title, desc, done=false) {
        this._id = id;
        this._title = title;
        this._desc = desc;
        this._done = done;
    }

    get id(){
        return this._id;
    }

    get title(){
        return this._title;
    }

    get description(){
        return this._desc;
    }

    set title(title){
        this._title = title;
    }

    set description(desc){
        this._desc = desc;
    }

    toggleStatus(){
        this.done = !this.done;
    }
}


class TodoList extends Array{
    static get [Symbol.species]() { return Array }

    addTask(id, title, desc){
        this.push(new Task(id, title, desc))
    }

    removeTask(id){
        let index = null;

        for(let i = 0; i < this.length; ++i){
            if (this[i].id == id) index = i;
        }

        const toDelete = this[index];
        this.splice(index, 1);

        return toDelete;
    }
}


class UIBuilder{
    static createElement(elementName, attributes={}){
        const el = document.createElement(elementName);

        if (attributes) {
            for (let attr in attributes){
                el.setAttribute(attr, attributes[attr]);
            }
        }

        return el;
    }

    static addText(element, str){
        const span = this.createElement('span');
        span.textContent = str;
        element.appendChild(span);
    }

    static bind2Event(event, element, cb){
        element.addEventListener(event, cb);
    }

    static appendChild(parent, child){
        parent.appendChild(child);
    }
}


class UIRenderer{
    constructor(rootElement=document.body) {
        this._root = rootElement;
    }

    update(newView){
        this.clear();
        this.render(newView);
    }

    clear(){
        this._root.removeChild(this._root.firstChild);
    }

    render(el){
        this._root.appendChild(el);
    }
}


class TaskView{

    static getTaskView(task){

        const root = UIBuilder.createElement('div', {
            'class': task.done ? 'tarefa concluida' : 'tarefa',
            'id': task.id
        });

        const title = UIBuilder.createElement('div', {
            'class': 'tarefa_titulo',
        });

        const desc = UIBuilder.createElement('div', {
            'class': 'tarefa_desc'
        });

        const actionContainer = UIBuilder.createElement('div', {
            'class': 'actions'
        });

        const doneButton = UIBuilder.createElement('div', {
            'class': 'button done-button'
        });

        const removeButton = UIBuilder.createElement('div', {
            'class': 'button remove-button'
        });

        UIBuilder.addText(title, task.title);
        UIBuilder.addText(desc, task.description);
        UIBuilder.addText(doneButton, 'Done');
        UIBuilder.addText(removeButton, 'Remove');

        UIBuilder.appendChild(actionContainer, doneButton);
        UIBuilder.appendChild(actionContainer, removeButton);

        UIBuilder.appendChild(root, title);
        UIBuilder.appendChild(root, desc);
        UIBuilder.appendChild(root, actionContainer);

        root.task = task

        return root;
    }
}

class TodoListView{
    static getTodoListView(todoList){
        const root = UIBuilder.createElement('div', {
            'class': 'container'
        });

        const navbar = UIBuilder.createElement('div', {
            'class': 'navbar'
        });

        const addItem = UIBuilder.createElement('div', {
            'id': 'add-item'
        });

        UIBuilder.addText(addItem, '+');

        UIBuilder.appendChild(navbar, addItem);

        UIBuilder.appendChild(root, navbar);

        for (let task of todoList){
            UIBuilder.appendChild(root, TaskView.getTaskView(task));
        }

        return root;
    }

}

class ToDoApp{
    constructor(rootElement, taskSelector) {
        this._taskSelector = taskSelector;
        this._rootElement = document.getElementById(rootElement);
        this._renderer = new UIRenderer(this._rootElement);
        this._todo = new TodoList();
        this._renderer.render(TodoListView.getTodoListView(this._todo));
    }

    addTask(task){
        this._todo.addTask(task.id, task.title, task.description, task.done);
        this._renderer.update(TodoListView.getTodoListView(this._todo));
        this.bindEvents();
    }

    removeTask(taskId){
        this._todo.removeTask(taskId);
        this._renderer.update(TodoListView.getTodoListView(this._todo));
        this.bindEvents();
    }

    bindEvents(){
        const tasks = this._rootElement.querySelectorAll(this._taskSelector);

        tasks.forEach((el, k, parent) => {
            el.querySelector('.remove-button').addEventListener('click', (ev) => {
                this.removeTask(el.task.id);
            });
        });

        tasks.forEach((el, k, parent) => {
            el.querySelector('.done-button').addEventListener('click', (ev) => {
                this._todo[k].toggleStatus();
                this._renderer.update(TodoListView.getTodoListView(this._todo));
                this.bindEvents();
            });
        });

    }

}

const app = new ToDoApp('app-root', '.tarefa');

for(let i = 0; i < 4; ++i){
    app.addTask(new Task(i, `Task ${ i } Title`, 'Task Description foo', true));
}
