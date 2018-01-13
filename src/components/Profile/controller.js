import { observable, computed, action } from "mobx";

export class UserProfileController {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }
  
  @observable name = "";

  @computed get name() {
    return this.name;
  }

  @action.bound
  changeName(newName) {
    this.name = newName;
  }
}

export default UserProfileController;