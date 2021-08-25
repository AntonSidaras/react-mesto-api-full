import React from 'react';

function PopupWithForm({onClose, onSubmit, isOpen, name, title, buttonCaption, isValidInputs, children}){
  return (
    <section className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <h2 className="popup__title">{title}</h2>
        <form className="popup__form" name="edit-profile" onSubmit={onSubmit} noValidate>
          {children}
          <button className={`popup__submit-button ${!isValidInputs ? "popup__submit-button_inactive" : ""}`} 
            type="submit" disabled={!isValidInputs} >{buttonCaption}</button>
        </form>
        <button className="popup__close-button" type="button" onClick={onClose}></button>
      </div>
    </section>
  );
}

export default PopupWithForm;