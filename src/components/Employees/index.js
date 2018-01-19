import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { TransitionGroup } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';
import { Button } from 'react-bootstrap';
import './style.css';

@inject("employeesStore")
@observer
class Employees extends Component {
  render() {
    const { employeesList, employeeName, addEmployee, deleteEmployee, onChangeName } = this.props.employeesStore;
    const timeout = { enter: 300, exit: 300 };
    const iconStyle = {
      width: "1.6em",
      height: "1.6em",
      color: "orange",
      cursor: "pointer"
    };

    return (
      <div className="g-card-content">
        <div className="g-page-title">Employees</div>
        <div className="list-wrapper">
          <form className="form">
            <input value={employeeName}
              name="name"
              placeholder="Enter name"
              type="text"
              className="form-input__field"
              onChange={(event) => onChangeName(event.target.value)} />
            <Button
              bsStyle="primary"
              className="theme-style"
              onClick={addEmployee}
            >
              Add
            </Button>
          </form>
          <TransitionGroup component="div" >
              {
                employeesList.map((employee, i) => {
                  return (
                    <CSSTransition key={i} timeout={timeout} classNames="Zoom">
                    <div className="item" key={i}>
                      {`${employee.name} - ${employee.age} years old`}
                      <div className="delete-button" onClick={() => deleteEmployee(employee)}>
                        <i className="far fa-times-circle" style={iconStyle}></i>
                      </div>
                    </div>
                    </CSSTransition>
                  )
                })
              }
          </TransitionGroup>
        </div>
      </div>
    );
  }
}

export default Employees;