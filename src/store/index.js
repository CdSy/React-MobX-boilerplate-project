import UiStore from './uiStore';
import UserProfileController from '../components/Profile/controller';

class RootStore {
    constructor() {
        this.uiStore = new UiStore(this);
        this.userProfileController = new UserProfileController(this);
    }
}

export default RootStore;