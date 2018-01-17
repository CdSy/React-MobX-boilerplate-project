import React from 'react';
import { CSSTransition } from 'react-transition-group';

const Fade = ({ children, ...props }) => (
  <CSSTransition
    timeout={750}
    classNames={"Fade-up"}
    {...props}
  >
    {children}
  </CSSTransition>
);

export default Fade;