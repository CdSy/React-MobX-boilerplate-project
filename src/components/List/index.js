import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { ListController } from './controller';
import './style.css';

@inject("listStore", "uiStore", "routing")
@observer class List extends Component {
  constructor() {
    super();
  }

  render() {
    const { location, push, goBack } = this.props.routing;

    return (
      <div>
        <div>
          Underage Persons
        {
          this.props.listStore.underageEmployee.map((person, i) => {
            return (
              <div className="row" key={i}>
                <div className="col">{person.name}</div>
              < div className="col">{person.age}</div>
              </div>)
          })
        }
        </div>
        <div>
          Adult Persons
        {
          this.props.listStore.adultEmployee.map((person, index) => {
            return (
              <div className="row" key={index} onClick={() => this.props.listStore.removePerson(person)}>
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

export default List;
