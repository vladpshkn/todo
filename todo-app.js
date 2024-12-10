(function() {
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return { form, input, button };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(todo) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = todo.name;

        if (todo.done) {
            item.classList.add('list-group-item-success');
        }

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return { item, doneButton, deleteButton };
    }

    function getStorageKey(uniqueId) {
        return `todo-list-${uniqueId}`;
    }

    function loadTodoListFromStorage(uniqueId) {
        let key = getStorageKey(uniqueId);
        let storedTodos = localStorage.getItem(key);
        return storedTodos ? JSON.parse(storedTodos) : [];
    }

    function saveTodoListToStorage(uniqueId, todos) {
        let key = getStorageKey(uniqueId);
        localStorage.setItem(key, JSON.stringify(todos));
    }

    function createTodoApp(container, title, uniqueId) {
        const instanceId = `todo-app-${uniqueId}`;
        const existingInstance = document.getElementById(instanceId);

        if (existingInstance) {
            return; 
        }

        const todoAppContainer = document.createElement('div');
        todoAppContainer.id = instanceId;

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        let todos = loadTodoListFromStorage(uniqueId);

        todoAppContainer.append(todoAppTitle);
        todoAppContainer.append(todoItemForm.form);
        todoAppContainer.append(todoList);

        function renderTodo(todo) {
            let todoItem = createTodoItem(todo);

            todoItem.doneButton.addEventListener('click', function() {
                todo.done = !todo.done;
                if (todo.done) {
                    todoItem.item.classList.add('list-group-item-success');
                } else {
                    todoItem.item.classList.remove('list-group-item-success');
                }
                saveTodoListToStorage(uniqueId, todos);
            });

            todoItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {
                    todoItem.item.remove();
                    todos = todos.filter(item => item.id !== todo.id);
                    saveTodoListToStorage(uniqueId, todos);
                }
            });

            todoList.append(todoItem.item);
        }

        if (todos.length > 0) {
            todos.forEach(renderTodo);
        }

        todoItemForm.button.disabled = true;

        todoItemForm.input.addEventListener('input', function () {
            todoItemForm.button.disabled = todoItemForm.input.value.trim() === '';
        });

        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!todoItemForm.input.value.trim()) {
                return;
            }

            let newTodo = {
                id: Date.now(),
                name: todoItemForm.input.value.trim(),
                done: false
            };
            todos.push(newTodo);
            renderTodo(newTodo);
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
            saveTodoListToStorage(uniqueId, todos);
        });

        container.appendChild(todoAppContainer);

    }

    window.createTodoApp = createTodoApp;
})();