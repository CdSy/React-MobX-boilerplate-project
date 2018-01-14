import UiStore from './uiStore';
import auth from './auth';
import UserProfileController from '../components/Profile/controller';

class RootStore {
    constructor() {
        this.uiStore = new UiStore(this);
        this.userProfileController = new UserProfileController(this);
        this.auth = auth;
    }
}

export default RootStore;