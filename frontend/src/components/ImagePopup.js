import React from 'react';

function ImagePopup({card, onClose}){
  return(
    <section className={`popup popup_type_img ${card ? "popup_opened" : ""}`}>
      <div className="popup__figure-container">
        <figure className="popup__figure">
          <img className="popup__image" src={card ? card.link : ""} alt={card ? card.name : ""}/>
          <figcaption className="popup__figcaption">{card ? card.name : ""}</figcaption>
        </figure>
        <button className="popup__close-button" type="button" onClick={onClose}></button>
       </div>
    </section>
  );
}

export default ImagePopup;