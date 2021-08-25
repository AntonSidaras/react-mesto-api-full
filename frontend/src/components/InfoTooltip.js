import React from 'react';

function InfoTooltip({name, isOpen, data, onClose}) {
  return (
    <section className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <div className="popup__reply-icon" style={{backgroundImage: `url(${data.image})`}}/>
        <span className="popup__reply-text">{data.text}</span>
        <button className="popup__close-button" type="button" onClick={onClose}></button>
      </div>
    </section>
  );
}

export default InfoTooltip;