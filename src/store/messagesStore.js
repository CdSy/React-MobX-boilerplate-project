import { observable, computed, action, toJS } from "mobx";

export default class MessagesStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable 
  state = {
    messages: [],
  }

  @computed
  get messages() {
    return toJS(this.state.messages);
  }

  @action
  setMessage = (message) => {
    this.state.messages.push(message);
  }

  @action
  removeMessage = (messageId) => {
    const index = messageId ? this.state.messages.indexOf(messageId) : 0;

    this.state.messages.splice(index, 1);
  }
}
