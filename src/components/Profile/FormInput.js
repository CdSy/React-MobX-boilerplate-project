import React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';

let getFormInputClasses = ({valid, error}) => classNames('form-input', {
    'form-input--error': !!error,
})

const FormInput = (props) => (
    <div className={getFormInputClasses(props)}>
      <input value={props.value || ''}
             name={props.name ||  'test'}
             placeholder={props.placeholder}
             type={props.type || 'text'}
             className="form-input__field"
             onChange={(event) => props.onChange(event.target.name, event.target.value)}/>
      {props.error && <div className="form-input__error">{props.error}</div> }
    </div>
);

export default observer(FormInput);