import Project from "./Project"
import { isToday, isSameWeek } from 'date-fns'

export default () => {
    const projects = []
    projects.push(Project("All Tasks"))
    projects.push(Project("Today"))
    projects.push(Project("This Week"))

    function addProject(name) {
        this.projects.push(new Project(name));
    }

    function getProject(name) {
        return this.projects.find(project => project.name == name)
    }

    function getToday() {
        let result = [];
        this.projects.forEach(project => {
            if (project.name != "Today" && project.name != "This Week") {
                result = result.concat(project.tasks.filter(task => isToday(task.dueDate)));
            }
        })
        return result;
    }

    function getThisWeek() {
        let result = [];
        this.projects.forEach(project => {
            if (project.name != "Today" && project.name != "This Week") {
                result = result.concat(project.tasks.filter(task => isSameWeek(task.dueDate, Date.now())));
            }
        })
        return result;
    }

    function updateToday() {
        this.getProject("Today").tasks = this.getToday()
        
    }

    function updateThisWeek() {
        this.getProject("This Week").tasks = this.getThisWeek()
    }

    return {projects, addProject, getProject, getToday, getThisWeek, updateToday, updateThisWeek}
}