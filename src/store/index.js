import UiStore from './uiStore';
import Auth from './auth';
import ProfileStore from './profile';
import EmployeesStore from './employees';

class RootStore {
    constructor() {
        this.uiStore = new UiStore(this);
        this.profileStore = new ProfileStore(this);
        this.auth = new Auth(this);
        this.employeesStore = new EmployeesStore();
    }
}

export default RootStore;