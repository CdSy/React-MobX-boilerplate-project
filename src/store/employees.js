import { observable, action } from "mobx";

export default class EmployeesStore {
    @observable employeesList = [
        {name: "Jone", age: 25},
        {name: "Robert", age: 35},
        {name: "Mark", age: 22},
        {name: "Albert", age: 16},
        {name: "Jake", age: 32},
        {name: "Mikle", age: 27},
        {name: "Arine", age: 25},
        {name: "Olli", age: 21}
    ];

    @observable employeeName = "";

    @action.bound
    addEmployee() {
        this.employeesList.unshift({name: this.employeeName, age: 20});
        this.employeeName = "";
    }

    @action.bound
    deleteEmployee(employee) {
        const index = this.employeesList.indexOf(employee);

        this.employeesList.splice(index, 1);
    }

    @action.bound
    onChangeName(name) {
        this.employeeName = name;
    }
}