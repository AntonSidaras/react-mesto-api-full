import React from "react";
import PopupWithForm from "./PopupWithForm";

function DeleteConfirmPopup({card, onClose, onDelete, buttonCaption}){

  function handleSubmit(event) {
    event.preventDefault();
  
    onDelete(card);
  } 

  return (
    <PopupWithForm onClose={onClose} onSubmit={handleSubmit} isOpen={card ? true : false} 
      name="delete-confirm" title="Вы уверены?" buttonCaption={buttonCaption.delete} isValidInputs={true}
    />
  );
}

export default DeleteConfirmPopup;