import { observable, computed, action } from "mobx";

export class TableController {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }
  
  @observable employee = [
    {name: 'David', age: 25},
    {name: 'Jack', age: 17},
    {name: 'David', age: 25},
    {name: 'David', age: 25},
    {name: 'David', age: 25},
    {name: 'David', age: 25},
    {name: 'David', age: 25},
    {name: 'David', age: 25},
    {name: 'David', age: 25},
    {name: 'David', age: 25},
  ];

  @computed get underageEmployee() {
    return this.employee.filter(e => e.age < 18);
  }

  @computed get adultEmployee() {
    return this.employee.filter(e => e.age >= 18);
  }

  @action.bound
  setPerson(value) {
    this.employee.push(value);
  }
}

export default TableController;