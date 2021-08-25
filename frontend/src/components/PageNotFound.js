import React from 'react';
import { Link } from 'react-router-dom';
import John from '../images/404/john.gif';

function PageNotFound () {
  return (
    <div className="not-found">
      <img className="not-found__picture" src={John} alt=""/>
      <h3 className="not-found__caption">
        Страница не найдена. Ошибка 
       <span> 404</span>
      </h3>
      <Link className="not-found__back" to="/">Назад</Link>
    </div>
  )
}

export default PageNotFound; 