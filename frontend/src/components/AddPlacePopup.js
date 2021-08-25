import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({isOpen, onClose, onAddPlace, buttonCaption}) {

  const [firstOpenForTitle, setFirstOpenForTitle] = React.useState(true); //убирает отрисовку красных полос при открытии попапа
  const [firstOpenForLink, setFirstOpenForLink] = React.useState(true); //убирает отрисовку красных полос при открытии попапа
  const [isTitleValid, setIsTitleValid] = React.useState(false);
  const [isLinkValid, setIsLinkValid] = React.useState(false);
  const titleErrorRef = React.useRef();
  const linkErrorRef = React.useRef();
  const titleRef = React.useRef();
  const linkRef = React.useRef();

  React.useEffect(() => {
    titleRef.current.value = "";
    linkRef.current.value = "";
    linkErrorRef.current.innerText = "";
    titleErrorRef.current.innerText = "";
    setIsLinkValid(false);
    setIsTitleValid(false);
    setFirstOpenForTitle(true);
    setFirstOpenForLink(true);
  }, [isOpen]);

  function handleSubmit(event) {
    event.preventDefault();
  
    onAddPlace({
      title: titleRef.current.value,
      link: linkRef.current.value
    });
  }

  function checkLinkInput(){
    setFirstOpenForLink(false);
    if(!linkRef.current.validity.valid){
      setIsLinkValid(false);
      linkErrorRef.current.innerText = linkRef.current.validationMessage;
    }
    else{
      setIsLinkValid(true);
      linkErrorRef.current.innerText = "";
    }
  }

  function checkTitleInput(){
    setFirstOpenForTitle(false);
    if(!titleRef.current.validity.valid){
      setIsTitleValid(false);
      titleErrorRef.current.innerText = titleRef.current.validationMessage;
    }
    else{
      setIsTitleValid(true);
      titleErrorRef.current.innerText = "";
    }
  }

  return (
    <PopupWithForm 
      onClose={onClose} onSubmit={handleSubmit} isOpen={isOpen} name="add" 
      title="Новое место" buttonCaption={buttonCaption.add} isValidInputs={isLinkValid && isTitleValid}
      >
      <input 
        className={`popup__input popup__input_first ${(!isTitleValid && !firstOpenForTitle) ? "popup__input_type_error" : ""}`} 
        id="title-input" type="text" name="title" defaultValue="" placeholder="Название" 
        minLength="2" maxLength="30" ref={titleRef} onChange={checkTitleInput} required
      />
      <span
        className={`popup__input-error link-input-error ${!isTitleValid ? "popup__input-error_active" : ""}`} 
        ref={titleErrorRef}>
      </span>
      <input 
        className={`popup__input popup__input_second ${(!isLinkValid && !firstOpenForLink) ? "popup__input_type_error" : ""}`} 
        id="link-input" type="url" name="link" defaultValue="" placeholder="Ссылка на картинку" 
        ref={linkRef} onChange={checkLinkInput} required
      />
      <span 
        className={`popup__input-error link-input-error ${!isLinkValid ? "popup__input-error_active" : ""}`} 
        ref={linkErrorRef}>
      </span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;