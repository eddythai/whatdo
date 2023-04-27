import Project from './Project'
import Storage from './Storage'
import Task from './Task'
import { startOfToday, getDate, format } from 'date-fns';

export default () => {
    const user = Storage().getUser()
    function loadHomePage(){
        user.updateToday();
        loadProjectList(user);
        const sideBar = document.querySelector(".side-bar");
        sideBar.firstChild.classList.toggle("selected");
        loadProject(user.projects[0]);
    }

    function loadProjectList(user) { //change user to local storage
        const sideBarElem = document.querySelector(".side-bar")
        const projectElem = document.createElement("div")

        sideBarElem.replaceChildren();
        projectElem.classList.add("side-content")

        user.projects.forEach(project => {
            let cloneProjectElem = projectElem.cloneNode();
            cloneProjectElem.innerText = `${project.name}`
            cloneProjectElem.addEventListener("click", e => {
                const selectedElem = document.querySelector(".selected")
                selectedElem.classList.toggle("selected");
                e.target.classList.toggle("selected");
                loadProject(project);
            });
            sideBarElem.appendChild(cloneProjectElem);
        })

    }

    function deleteTask(ID, project) {
        const deleteElem = document.createElement('button');
        deleteElem.type = "button";
        deleteElem.classList.add("task-delete");
        deleteElem.innerHTML = `
        <span>
            <ion-icon name="trash-outline" id="task-delete"></ion-icon>
        </span>`
    
        deleteElem.addEventListener("click", () => {
            Storage().removeTask(user, project, ID);
            loadProject(project);
        })
    
        return deleteElem
    
    }
    
    function checkTask(ID, project) {
        const boxElem = document.createElement('input');
        const task = project.tasks[ID]
    
        boxElem.type = "checkbox";
    
        if(task.checked == true) {
            boxElem.checked = true;
        }
        
        boxElem.addEventListener("change", () => {
            const taskElem = document.querySelector(`#task-${ID}`);
            taskElem.classList.toggle('checked');
            Storage().updateTask(user,project,ID);
        })
        return boxElem;
    }
    
    function createTask(task, ID, project) {
        const taskElement = document.createElement('div');
        const taskID = `task-${ID}`;
        taskElement.id = taskID;
        taskElement.classList.add("task");
    
        const taskLeft = document.createElement('div');
        taskLeft.classList.add("task-left");
        taskLeft.innerHTML = `<div class="task-title">${task.title}</div>`;
        taskLeft.insertBefore(checkTask(ID, project), taskLeft.lastChild)
        taskElement.appendChild(taskLeft);
    
        const taskRight = document.createElement('div');
        taskRight.classList.add("task-right");
        taskRight.innerHTML = `<div class="due-date">${format(task.dueDate, "MM/dd/yyyy")}</div>`;
        taskRight.appendChild(deleteTask(ID, project));
        taskElement.appendChild(taskRight);
    
        if (task.checked) taskElement.classList.add("checked");
        return taskElement
    }
    
    function loadTasks(project) {
        const tasks = project.tasks;
        const taskElement = document.createElement('div');
        taskElement.classList.add("task-container");
        tasks.forEach((task, index) => {
            taskElement.appendChild(createTask(task, index, project))
        })
        if (project.name !== "Today" && project.name !== "This Week") {
            const addTaskElement = document.createElement('div');
            addTaskElement.classList.add("add-task-container")
            addTaskElement.innerHTML =`
            <div class="task add-task">+ Add Task</div>
            <div class="add-task-popup hidden">
                <div class="input-container">
                    <label for="title"> Title </label>
                    <input type="text" id="title" name="title">
                </div>
                <div class="input-container">
                    <label for="due-date"> Due Date </label>
                    <input type="date" id="due-date" name="due-date">
                </div>
                <div class="response">
                    <button type=button id="submit">submit</button>
                    <button type=button id="cancel">cancel</button>
                </div>
        
            </div>`
            taskElement.appendChild(addTaskElement)
        }
        return taskElement
    }
    
    function loadProject(project) {
        const projectElement = document.querySelector(".project");
        projectElement.replaceChildren();
        projectElement.innerHTML = `<div class="project-title">TODO: ${project.name}</div>`
        projectElement.appendChild(loadTasks(project))
        if(project.name !== "Today" && project.name !== "This Week") initTaskButtons(project);
    }
    
    function initTaskButtons(project) { 
        const taskContainer = document.querySelector(".task-container")
        const addTaskContainer = document.querySelector(".add-task-container")
        const addTaskElem = document.querySelector(".add-task");
        const addTaskPopup = document.querySelector(".add-task-popup");
        const cancelTaskPopup = document.querySelector("#cancel");
        const submitTaskPopup = document.querySelector("#submit")
    
        const taskTitle = document.querySelector("#title");
        const taskDueDate = document.querySelector("#due-date");
    
        const toggleAddTask = () => {
            addTaskElem.classList.toggle("hidden");
            addTaskPopup.classList.toggle("hidden")
        }
    
        addTaskElem.addEventListener("click", toggleAddTask)
        cancelTaskPopup.addEventListener("click", toggleAddTask)
    
        const addError = inputElem => {
            if(!inputElem.classList.contains("invalid")){
                inputElem.classList.add("invalid")
            }
        }
    
        const submitForm = () => {
            if(taskTitle.value == ""){
                addError(taskTitle);
            } else {
                let date;
                if(!taskDueDate.value) {
                    date = startOfToday();
                } else {
                    let dateArr = taskDueDate.value.split("-").map(Number);
                    date = new Date(dateArr[0], dateArr[1]-1, dateArr[2]);
                }
                console.log(taskTitle.value)
                Storage().addTask(user, project, Task(false, taskTitle.value, date));
                const numTasks = project.tasks.length - 1;
                taskContainer.insertBefore(createTask(project.tasks[numTasks], numTasks, project), addTaskContainer);
                taskTitle.value = "";
                toggleAddTask();
            }
        }
    
        submitTaskPopup.addEventListener("click", submitForm)
    }

    return {loadHomePage}

}

