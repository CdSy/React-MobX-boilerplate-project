import { observable, computed } from "mobx";

export default class UiStore {
    @observable menuIsOpen = false;

    @computed get isOpen() {
        return this.menuIsOpen;
    }
}