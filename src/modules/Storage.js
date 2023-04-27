import User from "./User"
import Project from "./Project"
import Task from "./Task"

export default () => {
    function saveUser(data) {
        localStorage.setItem("user", JSON.stringify(data));
    }

    function getUser() {
       return Object.assign(User(), JSON.parse(localStorage.getItem("user"), (key, value) => {
        if (parseInt(key) || parseInt(key) == 0) {
            if(value.name) {
                return Object.assign(Project(value.name), value)
            } else {
                return Object.assign(Task(value.checked, value.title, value.dueDate))
            }
        } else if (key == "dueDate"){
            console.log(value)
            return new Date(value)
        }
        return value;
       }));
    }

    function addTask(data, project, task) {
        project.addTask(task);
        data.updateToday();
        data.updateThisWeek();
        saveUser(data)
    }

    function removeTask(data, project, ID){
        project.removeTask(ID);
        data.updateToday();
        data.updateThisWeek();
        saveUser(data)
    }

    function updateTask(data, project, ID){
        project.tasks[ID].setChecked();
        saveUser(data)
    }

    return {saveUser, getUser, addTask, removeTask, updateTask}
}