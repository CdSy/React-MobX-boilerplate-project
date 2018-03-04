import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { TransitionGroup } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';
import { Button } from 'react-bootstrap';
// import Clock from 'clock3d';
// import 'clock3d/style.css';
import './style.css';

@inject("employeesStore")
@observer
class Employees extends Component {
  // componentDidMount() {
  //   this.clock = new Clock({root: this.clock, perspective: true, direction: "up"});
  // }

  render() {
    const { employees, newEmployee, addEmployee, deleteEmployee, onChangeField } = this.props.employeesStore;
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
          <div className="clock" ref={(el) => this.clock = el}></div>
          <form className="form">
            <input value={newEmployee.name}
              name="name"
              placeholder="Enter name"
              type="text"
              className="form-input__field"
              onChange={(event) => onChangeField(event.target.name, event.target.value)} />
            <input value={newEmployee.age}
              name="age"
              placeholder="Enter age"
              type="text"
              className="form-input__field"
              onChange={(event) => onChangeField(event.target.name, event.target.value)} />
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
              employees.map((employee, i) => (
                  <CSSTransition key={employee.id} timeout={timeout} classNames="Zoom">
                    <div className="item">
                      {`${employee.name} - ${employee.age} years old`}
                      <div className="delete-button" onClick={() => deleteEmployee(employee)}>
                        <i className="far fa-times-circle" style={iconStyle}></i>
                      </div>
                    </div>
                  </CSSTransition>
              ))
            }
          </TransitionGroup>
        </div>
      </div>
    );
  }
}

export default Employees;
