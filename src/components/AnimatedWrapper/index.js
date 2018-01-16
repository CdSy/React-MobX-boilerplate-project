import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

function FirstChild(props) {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
}

const animateTransition = (WrappedComponent) => {
  return (props) => (
    <CSSTransitionGroup
      component={FirstChild}
      transitionEnterTimeout={300}
      transitionLeaveTimeout={200}
      transitionAppear={true}
      transitionAppearTimeout={300}
      transitionName={'Fade'}
    >
      <WrappedComponent { ...this.props } />
    </CSSTransitionGroup>)
};

export default animateTransition;