import { observable, computed, action } from "mobx";

export class ListController {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable employee = [
    {name: 'Mike', age: 25, id: 0},
    {name: 'Oliver', age: 15, id: 1},
    {name: 'Mike', age: 23, id: 2},
    {name: 'Mike', age: 24, id: 3},
    {name: 'Mike', age: 16, id: 4},
    {name: 'David', age: 28, id: 5},
    {name: 'Mike', age: 29, id: 6},
    {name: 'Mike', age: 20, id: 7},
    {name: 'Mike', age: 21, id: 8},
    {name: 'Mike', age: 26, id: 9},
  ];

  @computed get underageEmployee() {
    return this.employee.filter(e => e.age < 18);
  }

  @computed get adultEmployee() {
    return this.employee.filter(e => e.age >= 18);
  }

  @action.bound
  removePerson(person) {
    const index = this.employee.indexOf(person);
    
    this.employee.splice(index, 1);
  }

  @action.bound
  setPerson(value) {
    this.employee.push(value);
  }
}

export default ListController;