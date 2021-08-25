import React from "react";
import PopupWithForm from "./PopupWithForm";
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function EditAvatarPopup({isOpen, onClose, onUpdateAvatar, buttonCaption}) {

  const [isAvatarValid, setIsAvatarValid] = React.useState(true);
  const avatarErrorRef = React.useRef();
  const avatarRef = React.useRef();
  const user = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    avatarRef.current.value = user.currentUser.avatar;
    avatarErrorRef.current.innerText = "";
    setIsAvatarValid(true);
  }, [user.currentUser, isOpen]);

  function handleSubmit(event) {
    event.preventDefault();
  
    onUpdateAvatar({
      avatar: avatarRef.current.value
    });
  }

  function checkAvatarInput(){
    if(!avatarRef.current.validity.valid){
      setIsAvatarValid(false);
      avatarErrorRef.current.innerText = avatarRef.current.validationMessage;
    }
    else{
      setIsAvatarValid(true);
      avatarErrorRef.current.innerText = "";
    }
  }

  return (
    <PopupWithForm 
      onClose={onClose} onSubmit={handleSubmit} isOpen={isOpen} 
      name="change-avatar" title="Обновить аватар" buttonCaption={buttonCaption.others} 
      isValidInputs={isAvatarValid}
      >
      <input 
       className={`popup__input popup__input_first ${(!isAvatarValid) ? "popup__input_type_error" : ""}`} id="avatar-input" 
        type="url" name="avatar" placeholder="Ссылка на аватар"
        ref={avatarRef} onChange={checkAvatarInput} required
      />
      <span 
        className={`popup__input-error avatar-input-error ${!isAvatarValid ? "popup__input-error_active" : ""}`} 
        ref={avatarErrorRef}>
      </span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;