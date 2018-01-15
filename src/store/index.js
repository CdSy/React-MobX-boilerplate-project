import UiStore from './uiStore';
import Auth from './auth';
import ProfileStore from './profile';

class RootStore {
    constructor() {
        this.uiStore = new UiStore(this);
        this.profileStore = new ProfileStore(this);
        this.auth = new Auth(this);
    }
}

export default RootStore;