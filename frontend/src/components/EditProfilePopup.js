import React from "react";
import PopupWithForm from "./PopupWithForm";
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function EditProfilePopup({isOpen, onClose, onUpdateUser, buttonCaption}) {

  const [isNameValid, setIsNameValid] = React.useState(true);
  const [isAboutValid, setIsAboutValid] = React.useState(true);
  const nameErrorRef = React.useRef();
  const aboutErrorRef = React.useRef();
  const [user, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.currentUser.name);
    setDescription(currentUser.currentUser.about);
    setIsAboutValid(true);
    setIsNameValid(true);
    nameErrorRef.current.innerText = "";
    aboutErrorRef.current.innerText = "";
  }, [currentUser.currentUser, isOpen]);

  function handleChangeName(event){
    setName(event.target.value);
    checkNameInput(event.target);
  }

  function handleChangeDescription(event){
    setDescription(event.target.value);
    checkAboutInput(event.target);
  }

  function handleSubmit(event) {
    event.preventDefault();
  
    onUpdateUser({
      name: user,
      about: description
    });
  }

  function checkNameInput(input){
    if(!input.validity.valid){
      setIsNameValid(false);
      nameErrorRef.current.innerText = input.validationMessage;
    }
    else{
      setIsNameValid(true);
      nameErrorRef.current.innerText = "";
    }
  }

  function checkAboutInput(input){
    if(!input.validity.valid){
      setIsAboutValid(false);
      aboutErrorRef.current.innerText = input.validationMessage;
    }
    else{
      setIsAboutValid(true);
      aboutErrorRef.current.innerText = "";
    }
  }

  return (
    <PopupWithForm 
      onClose={onClose} onSubmit={handleSubmit} isOpen={isOpen} name="edit" 
      title="Редактировать профиль" buttonCaption={buttonCaption.others} isValidInputs={isNameValid && isAboutValid}
      >
      <input 
        className={`popup__input popup__input_first ${(!isNameValid) ? "popup__input_type_error" : ""}`}
        id="name-input" type="text" name="name" value={user} placeholder="Имя" 
        minLength="2" maxLength="40" onChange={handleChangeName} required
      />
      <span 
        className={`popup__input-error name-input-error ${!isNameValid ? "popup__input-error_active" : ""}`}
        ref={nameErrorRef}>
      </span>
      <input 
        className={`popup__input popup__input_second ${(!isAboutValid) ? "popup__input_type_error" : ""}`} 
        id="about-input" type="text" name="about" value={description} placeholder="О себе" 
        minLength="2" maxLength="200" onChange={handleChangeDescription} required
      />
      <span 
        className={`popup__input-error about-input-error ${!isAboutValid ? "popup__input-error_active" : ""}`}
        ref={aboutErrorRef}>
      </span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;