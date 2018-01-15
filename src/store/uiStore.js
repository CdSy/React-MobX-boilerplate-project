import { observable, computed, action } from "mobx";

export default class UiStore {
    @observable menuOpen = false;
    @observable menuNarrow = false;
    @observable currentTheme = "light";
    themeList = ["light","dark","green","blue"];

    @computed get menuIsOpen() {
        return this.menuOpen;
    }

    @action.bound
    stateMenuToggle() {
        this.menuOpen = !this.menuOpen;
    }

    @computed get menuIsNarrow() {
        return this.menuNarrow;
    }

    @action.bound
    widthMenuToggle() {
        this.menuNarrow = !this.menuNarrow;
    }

    @action.bound
    changeTheme(theme) {
        this.currentTheme = theme;

        document.body.classList= '';
        document.body.classList.add(this.currentTheme);
    }
}