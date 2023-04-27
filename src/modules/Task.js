export default (checked, title, dueDate) => {
    function setDate(newDate){
        this.dueDate = newDate;
    }

    function setChecked(){
        this.checked = !checked;
    }
    return {checked, title, dueDate, setDate, setChecked}
}