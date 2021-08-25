import React from 'react';
import { Route, Redirect } from "react-router-dom";
import {CurrentUserContext} from '../contexts/CurrentUserContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const user = React.useContext(CurrentUserContext); // получаем значения из контекста
  return (
    <Route {...rest} render={
      props => {
        if (user.isloggedIn) {
          return <Component {...rest} {...props} />
        } 
        else {
          return <Redirect to={
            {
              pathname: '"/sign-in"',
              state: {
                from: props.location
              }
            }
          } />
        }
      }
    } />
  )
};

export default ProtectedRoute;