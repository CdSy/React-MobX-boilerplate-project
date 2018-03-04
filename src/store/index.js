import UiStore from './uiStore';
import Auth from './auth';
import ProfileStore from './profile';
import EmployeesStore from './employees';
import UploaderStore from './uploaderStore';

class RootStore {
  constructor() {
    this.uiStore = new UiStore(this);
    this.profileStore = new ProfileStore(this);
    this.auth = new Auth(this);
    this.employeesStore = new EmployeesStore();
    this.uploaderStore = new UploaderStore(this);
  }
}

export default RootStore;
