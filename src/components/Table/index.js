import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import './style.css';

@inject("tableStore", "uiStore", "routing")
@observer
class Table extends Component {
  constructor() {
    super();
  }

  render() {
    const { location, push, goBack } = this.props.routing;

    return (
      <div>
        <div>
        {
          this.props.tableStore.underageEmployee.map((person, i) => {
            return (
              <div className="row" key={i}>
                <div className="col">{person.name}</div>
              < div className="col">{person.age}</div>
              </div>)
          })
        }
        </div>
        <div>
        {
          this.props.tableStore.adultEmployee.map((person, i) => {
            return (
              <div className="row" key={i}>
                <div className="col">{person.name}</div>
              < div className="col">{person.age}</div>
              </div>)
          })
        }
        </div>
      </div>
    );
  }
}

export default observer(Table);