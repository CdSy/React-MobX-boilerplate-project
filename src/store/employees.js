import { observable, computed, action } from "mobx";

export class Employee {
    constructor(name, age, id) {
        this.name = name;
        this.age = age;
        this.id = id;
        this.deleted = false;
    }
}

export default class EmployeesStore {
    @observable employeesList = [
        {name: "Jone", age: 25, id: 1, deleted: false},
        {name: "Robert", age: 35, id: 2, deleted: false},
        {name: "Mark", age: 22, id: 3, deleted: false},
        {name: "Albert", age: 16, id: 4, deleted: false},
        {name: "Jake", age: 32, id: 5, deleted: false},
        {name: "Mikle", age: 27, id: 6, deleted: false},
        {name: "Arine", age: 25, id: 7, deleted: false},
        {name: "Olli", age: 21, id: 8, deleted: false}
    ];

    @observable newEmployee = {
        name: "",
        age: ""
    };

    @computed
    get employees() {
        return this.employeesList.filter(employee => employee.deleted === false);
    }

    @action.bound
    addEmployee() {
        const newEmployee = {
            name: this.newEmployee.name,
            age: this.newEmployee.age,
            id: this.employeesList.length + 1,
            deleted: false
        };
        
        this.employeesList.unshift(newEmployee);
        this.clearForm();
    }

    @action.bound
    deleteEmployee(employee) {
        const index = this.employeesList.indexOf(employee);

        this.employeesList[index].deleted = true;
    }

    @action.bound
    onChangeField(field, value) {
        this.newEmployee[field] = value;
    }

    @action.bound
    clearForm() {
        this.newEmployee.name = "";
        this.newEmployee.age = "";
        this.newEmployee.id = "";
    }
}