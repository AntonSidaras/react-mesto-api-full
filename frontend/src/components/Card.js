import React from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function Card({card, onCardClick, onCardLike, onCardDelete}){

  const user = React.useContext(CurrentUserContext);
  const isLiked = card.likes.some(like => like._id === user.currentUser._id);
  const isOwn = card.owner._id === user.currentUser._id;

  function handleClick(){
    onCardClick(card);
  }

  function handleLikeClick(){
    onCardLike(card);
  }

  function handleDeleteClick(){
    onCardDelete(card);
  }

  return(
    <div id={card._id} className="elements__element">
      <button className="elements__image-container" type="button" onClick={handleClick}>
        <img className="elements__image" src={card.link} alt={card.name}/>
      </button>
      <div className="elements__name-and-like">
        <h2 className="elements__title">{card.name}</h2>
        <div className="elements__like-container">
        <button className={`elements__like ${isLiked ? "elements__like_active" : ""}`} type="button" onClick={handleLikeClick}></button>
          <span className="elements__like-counter">{card.likes.length}</span>
        </div>
      </div>
      <button className={`elements__remove ${isOwn ? "elemenst__remove_type_active" : ""}`} type="button" disabled={!isOwn} onClick={handleDeleteClick}></button>
    </div>
  );
}

export default Card;