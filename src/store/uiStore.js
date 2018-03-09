import { observable, computed, action } from "mobx";

export default class UiStore {
    @observable uploaderOpen = false;
    @observable menuOpen = true;
    @observable menuNarrow = false;
    @observable currentTheme = "light";
    themeList = ["light","dark","green","blue"];

    @observable loginModal = {isOpen: false};

    @action.bound
    closeModal(name) {
      this[name].isOpen = false;
    }

    @action.bound
    openModal(name) {
      this[name].isOpen = true;
    }

    @computed 
    get menuIsOpen() {
      return this.menuOpen;
    }

    @action.bound
    stateMenuToggle() {
      this.menuOpen = !this.menuOpen;
    }

    @computed 
    get uploaderIsOpen() {
      return this.uploaderOpen;
    }

    @action.bound
    openUploader(open = true) {
      if (open === false) {
        this.uploaderOpen = false;
      } else {
        this.uploaderOpen = !this.uploaderOpen;
      }
    }

    @computed 
    get menuIsNarrow() {
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
