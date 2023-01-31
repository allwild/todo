let num = 1;
let input_field = document.querySelector("#newtodo-input")
let taskList = document.querySelector("#list")
const addButton = document.querySelector("#addbuton")
taskList.children[0].appendChild(createTaskListHeader());
let selectAllCBox = document.querySelector("#selectall")
let checkBoxes = Array.from(document.getElementsByClassName("checkbox"));
addButton.addEventListener(("click"), function () {
    if (input_field.value == "") {
        alert("Please enter a new task!");
    } else if (isLatterThanStart() == false) {
        alert("Finish time should be later than start!")
    } else {
        addNewTask()
    }
})
input_field.addEventListener(("keydown"), function (e) {
    if (e.code === "Enter") {
        if (input_field.value != "") {
            addNewTask()
        } else {
            alert("Please enter a new task!")
        }
    }
})
taskList.addEventListener("click", turnTaskToGreen);

class Task () {

    constructor () {
        this.listItem = document.createElement("li");
        this.listItem.setAttribute("class", "entry");
        this.listItemContainer = document.createElement("div");
        this.listItemContainer.setAttribute("class", "listitem-container");
        this.checkBoxContainer = document.createElement("div");
    }
    
    /* Creates new input field for the task */
    create_taskEntry() {
        this.taskEntry = document.createElement("input");
        this.taskEntry.value = input_field.value;
        this.taskEntry.setAttribute("id", "task");
        this.taskEntry.setAttribute("class", "taskitem");
        this.taskEntry.setAttribute("type", "text");
        this.taskEntry.setAttribute("disabled", "");
        return this.taskEntry;
    }

    create_checkBox() {
        let checkBox = document.createElement("input");
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("id", "checkbox");
        checkBox.setAttribute("class", "checkbox");
        checkBox.checked = false;
        // if checkbox gets unchecked the "Select All" checkbox in the header gets unchecked as well
        checkBox.addEventListener("click", function () {
            if (checkBox.checked == false) {
                selectAllCBox.checked = false;
            } else if (isAllCheckboxChecked()) {
                selectAllCBox.checked = true;
            } 
        })
        return checkBox;
    }



}


/* Adds new task to the Tasklist */
function addNewTask() {
    let listItem = document.createElement("li");
    listItem.setAttribute("class", "entry")
    let listItemContainer = document.createElement("div");
    listItemContainer.setAttribute("class", "listitem-container")
    let checkBoxContainer = document.createElement("div")
    let item = create_taskEntry();
    input_field.value = "";
    let doneCheckBox = create_checkBox();
    let labelForCheckBox = create_label();
    checkBoxContainer.appendChild(doneCheckBox);
    checkBoxContainer.appendChild(labelForCheckBox);
    let delButton = create_deleteButton();
    let changeButton = create_editButton();
    let priority = create_Priority();
    let startTime = create_startTime();
    let finishTime = create_finishTime();
    let listItemsInContainer = new Array(priority, item, checkBoxContainer, startTime, finishTime, delButton, changeButton);
    addNumbersToIDs(listItemsInContainer, listItemContainer);
    listItem.appendChild(listItemContainer);
    taskList.appendChild(listItem);
    enableCheckAll();
    selectAllCBox.checked = false;
    addPriority();
    setInterval(isExpired, 1000)
}

/* Creates Tasklist Header */
function createTaskListHeader() {
    let priority = document.createElement("p");
    priority.innerHTML = "Priority"
    let task = document.createElement("p");
    task.innerHTML = "Task";
    let checkAllContainer = document.createElement("div");
    let checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("disabled", "");
    checkBox.setAttribute("id", "selectall");
    checkBox.addEventListener("click", selectAllCheckbox)
    let label = document.createElement("label");
    label.innerHTML = "All Done";
    label.setAttribute("for", "selectall")
    checkAllContainer.appendChild(checkBox);
    checkAllContainer.appendChild(label);
    let delBtn = document.createElement("button");
    delBtn.innerHTML = "Delete All";
    delBtn.addEventListener("click", deleteAllEntries)    
    let edBtn = document.createElement("button");
    edBtn.innerHTML = "Dummy All";
    let startTime = document.createElement("span");
    startTime.innerHTML = "Start Time";
   let finisTime = document.createElement("span");
   finisTime.innerHTML = "Finish Time";
    let tempArr = [priority, task, checkAllContainer, startTime, finisTime, delBtn, edBtn];
    let headerContainer = document.createElement("div");
    headerContainer.setAttribute("class", "listitem-container");
    tempArr.forEach(element => {
        headerContainer.appendChild(element)
    });
    return headerContainer;
}

/* Deletes all entries from Tasklist */ 
function deleteAllEntries() {
    if (isAllCheckboxChecked()) {
        if (window.confirm("You are about to delete all tasks! Are you sure?")) {
            Array.from(document.querySelectorAll(".entry")).forEach(element => {
                element.remove();
            });
            enableCheckAll();
        }
    } else {
        alert("Please check all the tasks before deleting!")
    }
}

/* Select all the checkboxes of the taskitems when pressed */
function selectAllCheckbox() {
    let checkBoxes = Array.from(document.getElementsByClassName("checkbox"));
    if (selectAllCBox.checked == true) {
        checkBoxes.forEach(element => {
            element.checked = true;
        });
    } else if (selectAllCBox.checked == false) {
        checkBoxes.forEach(element => {
            element.checked = false;
        });
    }
}

/* Enables select all checkbox if there is at least one entry in tasklist */
function enableCheckAll() {
    let checkBoxes = Array.from(document.getElementsByClassName("checkbox"));
    if (checkBoxes.length < 1) {
        selectAllCBox.checked = false;
        selectAllCBox.disabled = true;
    } else {
        selectAllCBox.disabled = false;
    }
}


/* Numbers IDs of new item a.k.a. input field and checkboxes then adds all the corresponding parameters to the div #listItemContainer*/
function addNumbersToIDs(arr, container) {
    for (let i = 0; i < arr.length; i++) {
        if (i == 1) {
            let baseID = arr[i].getAttribute("id");
            arr[i].setAttribute("id", baseID + (num));
        } else if (i == 2) {
            let baseID = arr[i].children[0].getAttribute("id");
            arr[i].children[0].setAttribute("id", baseID + (num));
        }   
        container.appendChild(arr[i]);
    };
    num++;
}

/* Creates a priority span for new entries */1
function create_Priority() {
    let priorityContainer = document.createElement("div");
    let prioritySpan = document.createElement("span");
    let priorityUp = moveUpPriority();
    let priorityDown = moveDownPriority();
    priorityContainer.appendChild(priorityUp)
    priorityContainer.appendChild(prioritySpan);
    priorityContainer.appendChild(priorityDown)
    return priorityContainer;
}

/* Responsible for moving priority up when UP icon pressed */
function moveUpPriority() {
    let icon = document.createElement("i");
    icon.setAttribute("class", "fa-solid fa-arrow-up");
    icon.addEventListener("click", function () {
        let parentListItem = icon.closest("li");
        let onAbove = parentListItem.previousElementSibling;
        if (onAbove != taskList.children[0]) {
            taskList.insertBefore(parentListItem, onAbove);
            addPriority();
        }
    })
    return icon;
}

/* Responsible for moving priority up when UP icon pressed */
function moveDownPriority() {
    let icon = document.createElement("i");
    icon.setAttribute("class", "fa-solid fa-arrow-down");
    icon.addEventListener("click", function () {
        let parentListItem = icon.closest("li");
        let oneBelow = parentListItem.nextElementSibling;
        if (oneBelow) {
            oneBelow.after(parentListItem)
            addPriority()
        }
    })
    return icon;
}

/* Iterates through listitems (of ul) and add their indices to items as priority */
function addPriority() {
    let activeItems = Array.from(taskList.children)
    activeItems.forEach(element => {
        if (activeItems.indexOf(element) > 0) {
            element.firstChild.firstChild.children[1].innerHTML = activeItems.indexOf(element)
        }
    });
}

/* Checks if all the checkboxes are checked */
function isAllCheckboxChecked() {
    let checkBoxes = Array.from(document.getElementsByClassName("checkbox"));
    let counter = 0;
    checkBoxes.forEach(element => {
        if (element.checked == true) {
            counter++;
        }
    });
    if (counter == checkBoxes.length) {
        return true;
    } else {
        return false;
    }
}

/* Creates new doneCheckBoxes */
function create_checkBox() {
    let checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("id", "checkbox");
    checkBox.setAttribute("class", "checkbox");
    checkBox.checked = false;
    // if checkbox gets unchecked the "Select All" checkbox in the header gets unchecked as well
    checkBox.addEventListener("click", function () {
        if (checkBox.checked == false) {
            selectAllCBox.checked = false;
        } else if (isAllCheckboxChecked()) {
            selectAllCBox.checked = true;
        } 
    })
    return checkBox;
}

/* Creates new labels for checkBoxes*/
function create_label() {
    let label = document.createElement("label");
    label.innerHTML = "Done";
    label.setAttribute("for", ("checkbox" + num));
    return label;
}

/* Creates a new task */



/* Creates a new Edit button */
function create_editButton() {
    let edButton = document.createElement("button");
    edButton.innerHTML = "Edit";
    edButton.addEventListener("click", function () {
        if (edButton.innerHTML === "Edit") {
            edButton.innerHTML = "Save";
            edButton.parentElement.children[1].removeAttribute("disabled");
        } else {
            edButton.innerHTML = "Edit";
            edButton.parentElement.children[1].setAttribute("disabled", "");
        }
    })
    return edButton;
}

/* Creates a new delButton */
function create_deleteButton() {
    let delButton = document.createElement("button");
    delButton.setAttribute("class", "delete");
    delButton.innerHTML = "Delete";
    delButton.addEventListener("click", function () {
        if (delButton.parentElement.children[2].children[0].checked == true) {
            if (window.confirm("You are about to delete a task! Are you sure?")) {
                delButton.closest("li").remove();
                enableCheckAll();
                addPriority();
            }
        } else {
            alert("Please check task before deleting!")
        }
    })
    return delButton;
}


function create_startTime() {
    let startTime = document.createElement("input");
    let newTime = document.querySelector("#starttime");
    startTime.setAttribute("type", "time");
    startTime.value = newTime.value;
    return startTime;
}


function create_finishTime() {
    let finishTime = document.createElement("input");
    let newTime = document.querySelector("#finishtime");
    finishTime.setAttribute("type", "time");
    finishTime.value = newTime.value;
    return finishTime;
}

/* Checks if finish time is latter than start for new entries. If not alert message gets displayed */
function isLatterThanStart() {
    let startTime = create_startTime().value.replace(":", "");
    let finishTime = create_finishTime().value.replace(":", "");
    if (parseInt(startTime) >= parseInt(finishTime)) {
        return false;
    }
}

/* Retrieves system time */
function getTime() {
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let time = isTwoDigits(hours) + ":" + isTwoDigits(minutes);
    return time
}

/* Checks whether minutes provided by the system is one or two digit format. If one it adds a zero as the first digit. */
function isTwoDigits(digit) {
    let digitArray = Array.from(digit.toString());
    if (digitArray.length === 1) {
        digitArray.unshift('0');
    }
    return digitArray.toString().replace(/,/g, "")
}

/* Checks whether finishTime has expired compared to system time  */
function isExpired() {
    let finishTime = convertTimeToNum(create_finishTime().value);  
    let systemTime = convertTimeToNum(getTime())
    if (parseInt(systemTime) == parseInt(finishTime)) { 
        alert(`Task  has expired`)
    }
}

/* Converts time format to integer */
function convertTimeToNum(time) {
    let oldArray = Array.from(time);
    let newArray = [];          
    for (let i = 0; i < oldArray.length; i++) {
        if (oldArray[i] === ':') {
            continue;
        } else {
            newArray.push(oldArray[i])
        }
    }
    return newArray.toString().replace(/,/g, "")
}

/* Turns task items to Green background when "DONE" is clicked */
function turnTaskToGreen() {
    let items = Array.from(document.getElementsByClassName("taskitem"));
    let checkBoxes = Array.from(document.getElementsByClassName("checkbox"));
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked == true) {
            items[i].style.backgroundColor = "green";
            items[i].style.color = "blue";
        } else {
            items[i].removeAttribute("style")
        }
    }
}



