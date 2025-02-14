const uri = 'api/todoitems';
let todos = [];

async function getItems() {
    try {
        const res = await fetch(uri);
        const data = await res.json();
        _displayItems(data);
    } catch (error) {
        console.error('Unable to get items.', error);
    }
}

async function addItem() {
    const addNameTextbox = document.getElementById('add-name');
    const addDeadlineTextbox = document.getElementById('add-deadline');

    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim(),
        deadline: addDeadlineTextbox.value.trim() || null,
    };

    try {
        const res = await fetch(uri, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });
        await res.json();
        getItems();
        addNameTextbox.value = '';
        addDeadlineTextbox.value = '';
    } catch (error) {
        console.error('Unable to add item.', error);
    }
}

async function deleteItem(id) {
    try {
        await fetch(`${uri}/${id}`, { method: 'DELETE' });
        getItems();
    } catch (error) {
        console.error('Unable to delete item.', error);
    }
}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('edit-deadline').value = item.deadline || '';
    document.getElementById('editForm').style.display = 'block';
}

async function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        isComplete: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim(),
        deadline: document.getElementById('edit-deadline').value.trim() || undefined
    };

    try {
        await fetch(`${uri}/${itemId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });
        getItems();
    } catch (error) {
        console.error('Unable to update item.', error);
    }

    closeInput();
    return false;
}

// Close the edit form
function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

// Update the count of to-do items
function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'Task' : 'Tasks';
    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

// Display the list of to-do items
function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.isComplete;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        if (item.deadline) {
            td3.appendChild(document.createTextNode(item.deadline));
        } else {
            td3.appendChild(document.createTextNode(''));
        }

        let td4 = tr.insertCell(3);
        td4.appendChild(editButton);

        let td5 = tr.insertCell(4);
        td5.appendChild(deleteButton);
    });

    todos = data;
}