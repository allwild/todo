let num = 1;
let i = 0;
const input_field = document.querySelector("#newtodo-input")
input_field.addEventListener(("keydown"), function (e) {
    if (e.code === "Enter") {
        if (input_field.value != "") {
            createNewTask()
        } else {
            alert("Please enter a new task!")
        }
    }
});
const taskList = document.querySelector("#list")
const addButton = document.querySelector("#addbuton")
addButton.addEventListener(("click"), function () {
    if (input_field.value == "") {
        alert("Please enter a new task!");
    } else if (isLatterThanStart() == false) {
        alert("Finish time should be later than start!")
    } else {
        createNewTask()
    }
});
const selectAllCBox = document.querySelector("#selectall")
selectAllCBox.addEventListener("click", isAllCheckboxChecked)
selectAllCBox.addEventListener("click", selectAllCheckbox)
const deleteAll = document.querySelector("#deleteall");
deleteAll.addEventListener("click", deleteAllEntries)




class Task {

    constructor() {
        this.listItem = document.createElement("li");
        this.listItem.setAttribute("class", "entry");
        this.listItemContainer = document.createElement("div");
        this.listItemContainer.setAttribute("class", "listitem-container");
        this.checkBoxContainer = document.createElement("div");
        this.listItem.appendChild(this.listItemContainer);
        this.finishTime = document.createElement("input");
        this.isAlerted = false; // Serves as a checker for isExpired()
        this.title = input_field.value;
        this.finishTimeToBeChecked = convertTimeToNum(this.create_finishTime().value);
        this.taskEntry = document.createElement("input");
        this.listItemArray = [this.create_Priority(), this.create_taskEntry(), this.create_startTime(), this.create_finishTime(), this.create_checkBox(), this.create_label(), this.create_deleteButton(), this.create_editButton()];
    }

    /* Creates a priority span for new entries */1
    create_Priority() {
        this.priorityContainer = document.createElement("div");
        this.priorityContainer.setAttribute("class", "prioritycontainer")
        this.prioritySpan = document.createElement("span");
        this.priorityContainer.appendChild(this.moveUpPriority())
        this.priorityContainer.appendChild(this.prioritySpan);
        this.priorityContainer.appendChild(this.moveDownPriority())
        return this.priorityContainer;
    }

    /* Responsible for moving priority up when UP icon pressed */
    moveUpPriority() {
        this.icon = document.createElement("i");
        this.icon.setAttribute("class", "fa-solid fa-chevron-up");
        this.icon.addEventListener("click", function () {
            this.parentListItem = this.closest("li");
            this.onAbove = this.parentListItem.previousElementSibling;
            if (this.onAbove != taskList.children[-1]) {
                taskList.insertBefore(this.parentListItem, this.onAbove);
                addPriority();
            }
        })
        return this.icon;
    }

    /* Responsible for moving priority up when UP icon pressed */
    moveDownPriority() {
        this.icon = document.createElement("i");
        this.icon.setAttribute("class", "fa-solid fa-chevron-down");
        this.icon.addEventListener("click", function () {
            this.parentListItem = this.closest("li");
            this.oneBelow = this.parentListItem.nextElementSibling;
            if (this.oneBelow) {
                this.oneBelow.after(this.parentListItem);
                addPriority();
            }
        })
        return this.icon;
    }

    /* Creates new input field for the task */
    create_taskEntry() {
        this.taskEntry.value = input_field.value;
        this.taskEntry.setAttribute("id", "task" + num);
        this.taskEntry.setAttribute("class", "taskitem");
        this.taskEntry.setAttribute("type", "text");
        this.taskEntry.setAttribute("disabled", "");
        this.taskEntry.style.backgroundColor = "ececec00"
        return this.taskEntry;
    }

    /* Creates checkbox per line. */
    create_checkBox() {
        this.checkBox = document.createElement("input");
        this.checkBox.setAttribute("type", "checkbox");
        this.checkBox.setAttribute("id", "checkbox" + num);
        this.checkBox.setAttribute("class", "checkbox");
        this.checkBox.checked = false;
        // if checkbox gets unchecked the "Select All" checkbox in the header gets unchecked as well
        this.checkBox.addEventListener("click", function () {
            if (this.checked == false) {
                selectAllCBox.checked = false;
            } else if (isAllCheckboxChecked()) {
                selectAllCBox.checked = true;
            }
        })
        /* sets taskEntry's background color based on checkBox status  */
        this.checkBox.addEventListener("click", function () {
            if (this.checked == true) {
                this.parentElement.parentElement.style.backgroundColor = "#a6c8af"
            } else {
                this.parentElement.parentElement.style.backgroundColor = "#ececec"
            }
        })
        this.checkBoxContainer.appendChild(this.checkBox);
        return this.checkBoxContainer;

    }

    /* Creates new labels for checkBoxes*/
    create_label() {
        this.label = document.createElement("label");
        this.label.innerHTML = "Done";
        this.label.setAttribute("for", ("checkbox" + num));
        this.checkBoxContainer.appendChild(this.label);
        return this.checkBoxContainer;
    }

    /* Creates a new delButton */
    create_deleteButton() {
        this.delButton = document.createElement("i");
        this.delButton.setAttribute("class", "fa-regular fa-trash-can");
        this.delButton.addEventListener("click", function () {
            if (this.parentElement.children[4].children[0].checked == true) {
                if (window.confirm("You are about to delete a task! Are you sure?")) {
                    this.closest("li").remove();
                    enableCheckAll();
                    addPriority();
                }
            } else {
                alert("Please check task before deleting!")
            }
        })
        return this.delButton;
    }

    /* Creates a new Edit button */
    create_editButton() {
        this.edButton = document.createElement("i");
        this.edButton.setAttribute("class", "fa-solid fa-file-pen")
        this.edButton.addEventListener("click", function () {
            console.log(this.getAttribute('class'))
            if (this.getAttribute("class") == "fa-solid fa-file-pen") {
                this.setAttribute("class", "fa-regular fa-floppy-disk") 
                this.parentElement.children[1].removeAttribute("disabled");
            } else {
                this.setAttribute("class", "fa-solid fa-file-pen")
                this.parentElement.children[1].setAttribute("disabled", "");
            }
        })
        return this.edButton;
    }

    /* creates input field for the starting time of the task then gives it the value of the time entered in #starttime */
    create_startTime() {
        this.startTime = document.createElement("input");
        this.newTime = document.querySelector("#starttime");
        this.startTime.setAttribute("type", "time");
        this.startTime.setAttribute("disabled", "");
        this.startTime.value = this.newTime.value;
        return this.startTime;
    }

    /*  Creates input field for task deadline as per task */
    create_finishTime() {
        this.newTime = document.querySelector("#finishtime");
        this.finishTime = document.createElement("input");
        this.finishTime.setAttribute("type", "time");
        this.finishTime.setAttribute("disabled", "");
        this.finishTime.value = this.newTime.value;
        return this.finishTime;
    }

    /* Appends all the corresponding elements of a task into one container */
    appendListItems() {
        this.listItemArray.forEach(
            element => this.listItemContainer.appendChild(element)  
        )
    }

    /* Retrieves system time */
    getTime() {
        this.today = new Date();
        this.hours = this.today.getHours();
        this.minutes = this.today.getMinutes();
        this.time = isTwoDigits(this.hours) + ":" + isTwoDigits(this.minutes);
        return this.time
    }

    /* Checks whether finishTime has expired compared to system time  */
    isExpired() {
        this.systemTime = convertTimeToNum(this.getTime());
        if (parseInt(this.systemTime) == parseInt(this.finishTimeToBeChecked)) {
            this.isAlerted = true;
            alert(`Task ${this.taskEntry.value} has expired`);
        }

    }                       

    /* Checks whether task deadline has been expired until this.isAlerted handler is false */
    checkTime() {
        setInterval(() => {
            if (this.isAlerted == false) {
                this.isExpired()
            }
        }, 1000)
    }
}

function createNewTask() {
    let newTask = new Task;
    newTask.checkTime();
    newTask.appendListItems();
    input_field.value = ""
    taskList.appendChild(newTask.listItem)
    addPriority();
    enableCheckAll();
    num++;
    i++;

}


/* Iterates through listitems (of ul) and add their indices to items as priority */
function addPriority() {
    let activeItems = Array.from(taskList.children)
    activeItems.forEach(element => {
        if (activeItems.indexOf(element) > -1) {
            element.firstChild.firstChild.children[1].innerHTML = activeItems.indexOf(element) + 1;
        }
    });
}

/* Checks if finish time is latter than start for new entries. If not alert message gets displayed */
function isLatterThanStart() {
    let startTime = document.querySelector("#starttime").value.replace(":", "");
    let finishTime = document.querySelector("#finishtime").value.replace(":", "");
    if (parseInt(startTime) >= parseInt(finishTime)) {
        return false;
    }
}
/* CHECBOX */

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

/* Select all the checkboxes of the taskitems when pressed */
function selectAllCheckbox() {
    let checkBoxes = Array.from(document.getElementsByClassName("checkbox"));
    if (selectAllCBox.checked == true) {
        checkBoxes.forEach(element => {
            element.checked = true;
            element.parentElement.parentElement.style.backgroundColor = "#a6c8af"
        });
    } else if (selectAllCBox.checked == false) {
        checkBoxes.forEach(element => {
            element.checked = false;
            element.parentElement.parentElement.style.backgroundColor = "#ececec"
        });
    }
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

/* STOP WATCH */


/* Checks whether minutes provided by the system is one or two digit format. If one it adds a zero as the first digit. */
function isTwoDigits(digit) {
    let digitArray = Array.from(digit.toString());
    if (digitArray.length === 1) {
        digitArray.unshift('0');
    }
    return digitArray.toString().replace(/,/g, "")
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

