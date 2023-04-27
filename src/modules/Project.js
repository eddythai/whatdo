import Task from './Task'

export default (name) => {

    const tasks = [];
    function addTask(task) {
        this.tasks.push(task)
    }
    function removeTask(index) {
        this.tasks.splice(index,1);
    }
    return {name, tasks, addTask, removeTask}
}