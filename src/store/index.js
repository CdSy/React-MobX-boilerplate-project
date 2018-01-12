import {observer} from 'mobx-react';
import TableController from '../components/Table/controller';
import ListController from '../components/List/controller';
import UiStore from './uiStore';

class RootStore {
    constructor() {
        this.uiStore = new UiStore(this);
        this.tableStore = new TableController(this);
        this.listStore = new ListController(this);
    }
}

export default RootStore;