const colorThemeLSKey = "color-theme"
const inputCreate = document.querySelector('#input-create');
const list = document.querySelector('.list');
const containerDeleteTask = document.querySelector('#deleteTasks');
const buttonClearComplete = document.querySelector('.clearCompleted');
const countElement = document.querySelector('#count');
const imageDelete = document.querySelector('#image-delete');
let checkboxElementTheme = document.querySelector('#theme-toggle');
let arrayList = [];


Sortable.create(list, {
    animation: 150,
    group: {
        name: 'list-tasks',
        pull: true,
    },
    store: {
        set: (sortable) => {
            const order = sortable.toArray();
            localStorage.setItem(sortable.options.group.name, order.join(','));
        },

        get: (sortable) => {
            const order = localStorage.getItem(sortable.options.group.name);
            return order ? order.split(',') : [];
        }
    }

})

Sortable.create(containerDeleteTask, {
    animation: 150,
    group: {
        name: 'list-tasks'
    },
    store: {
        set: (sortable) => {
            const order = sortable.toArray();
            localStorage.setItem(sortable.options.group.name, order.join(','));
        },

        get: (sortable) => {
            const order = localStorage.getItem(sortable.options.group.name);
            return order ? order.split(',') : [];
        }
    },
    onAdd: function (e) {
        var itemEl = e.item;
        imageDelete.classList.remove('image-delete-active');
        let id = itemEl.id;
        console.log(id)
        let element = document.getElementById(id);
        borrarElemetos(element);
        removeItemWhitButtonDelete(id);

    }

})

function borrarElemetos(element) {
    containerDeleteTask.removeChild(element);
}


readThemeFromLS();

window.addEventListener('load', () => {
    if (getLocalStorageTaskList() !== null) {
        arrayList = getLocalStorageTaskList();
        createNewElementList(arrayList);
    }
})



class Task {
    constructor(id, text, completed) {
        this.id = id;
        this.text = text;
    }
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function getNewElement(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        let contentElementList = inputCreate.value;
        if (contentElementList.length != 0) {
            arrayList.push(new Task(generateUUID(), contentElementList));
            setLocalStorageTaskList(arrayList)
            createNewElementList(getLocalStorageTaskList());
        } else {
            alert('Ingrese una tarea')
        }
    }

}
inputCreate.addEventListener('keydown', (e) => {
    getNewElement(e);
});


function setLocalStorageTaskList(value) {
    try {
        localStorage.setItem("list-task", JSON.stringify(value))
    } catch {
        console.log("error en local storage set")
    }
}
function getLocalStorageTaskList() {
    try {
        return JSON.parse(localStorage.getItem("list-task"));
    } catch {
        console.log("error en local storage get")
    }
}

function removeLocalStorageTaskList() {
    localStorage.removeItem("list-task");
}
let arrayListWhitButtonDelete = []
function createNewElementList(itemsList) {
    list.innerHTML = '';
    if (itemsList.length !== 0) {
        for (let i = 0; i < itemsList.length; i++) {
            let li = document.createElement('li');
            li.className = 'element-list';
            li.setAttribute('draggable', 'true');
            li.setAttribute('id', itemsList[i].id);
            let input = document.createElement('input');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('id', `task-${itemsList[i].id}`);
            let label = document.createElement('label');
            label.setAttribute('for', `task-${itemsList[i].id}`);
            label.textContent = itemsList[i].text;
            let buttonDelete = document.createElement('button');
            buttonDelete.textContent = 'X';
            buttonDelete.setAttribute('data-id', itemsList[i].id);

            li.appendChild(input);
            li.appendChild(label);
            li.appendChild(buttonDelete)
            list.appendChild(li)
            input.addEventListener('change', (e) => {
                if (e.target.checked) {
                    li.classList.add('completed');

                } else {
                    li.classList.remove('completed');

                }

            })
            buttonDelete.addEventListener('click', (e) => {
                e.preventDefault();
                list.removeChild(li);
                removeItemWhitButtonDelete(e.target.dataset.id);
            })
            resetInput();
            contadorElementList(getLocalStorageTaskList());
        }
    }

}
let arrayFilter = [];
function removeItemWhitButtonDelete(id) {
    let arrayFilter = [];
    arrayList.filter((item) => {
        if (item.id != id) {
            arrayFilter.push(item)
        }
    })
    arrayList = arrayFilter;
    setLocalStorageTaskList(arrayList);
    contadorElementList(arrayList);
}

function contadorElementList(arrayList) {
    const countItems = arrayList.length;
    countElement.textContent = countItems;
}

function resetInput() {
    inputCreate.value = '';
}




function clearComplete() {
    const elementsList = list.childNodes;
    for (let i = 0; i < elementsList.length; i + 2) {
        list.removeChild(elementsList[i]);
    }
    arrayList = [];
    removeLocalStorageTaskList();
    contadorElementList(arrayList);
}

buttonClearComplete.addEventListener('click', clearComplete);

checkboxElementTheme.checked = isUsingDarkMode();

checkboxElementTheme.addEventListener('change', function () {

    if (this.checked) {
        changetoDarkMode();
    } else {
        changetoLigthMode();
    }


})
function changetoLigthMode() {
    let bodyElement = document.querySelector('body');
    bodyElement.classList.remove("force-dark-theme")
    bodyElement.classList.add("force-ligth-theme");
    setColorThemeFromLS("ligth");;
}
function changetoDarkMode() {
    let bodyElement = document.querySelector('body');
    bodyElement.classList.remove("force-ligth-theme");
    bodyElement.classList.add("force-dark-theme");
    setColorThemeFromLS("dark");

}
function readThemeFromLS() {
    let colorTheme = getColorThemeFromLS();
    if (!colorTheme) return;

    if (colorTheme === "ligth") {
        changetoLigthMode();
    } else {
        changetoDarkMode();
    }
}


function setColorThemeFromLS(value) {
    try {
        window.localStorage.setItem("color-theme", value)
    } catch {
        console.log("error en local storage set")
    }
}

function getColorThemeFromLS() {
    try {
        return window.localStorage.getItem("color-theme");
    } catch {
        console.log("error en local storage get")
    }
}

function isUsingDarkMode() {
    let bodyElement = document.querySelector('body');
    let bodyStyle = getComputedStyle(bodyElement);
    let bodyBGColor = rgb2hex(bodyStyle.backgroundColor);
    let darkModeBGColor = "#3A3A3A";
    return darkModeBGColor === bodyBGColor;

}



function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s?\d+\.\d+)?\);?$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return ("#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])).toUpperCase();
}

