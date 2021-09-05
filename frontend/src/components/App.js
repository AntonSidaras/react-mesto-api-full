import React from "react";
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import Header from "./Header";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import Footer from "./Footer";
import Main from "./Main";
import DeleteConfirmPopup from "./DeleteConfirmPopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import Loader from "./Loader";
import PageNotFound from "./PageNotFound";
import Api from '../utils/api';
import onLoadImage from "../images/profile/Card-load.gif"
import onSuccessAuth from "../images/popup/ok.svg"
import onFailureAuth from "../images/popup/fail.svg"
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function App() {

  const buttonCaptionDefault = {add: "Создать", delete: "Да", others: "Сохранить"};
  const toolTipDataFail = {image: onFailureAuth, text:"Что-то пошло не так! Попробуйте ещё раз."};
  const toolTipDataSuccess = {image: onSuccessAuth, text:"Вы успешно зарегистрировались!"};

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [jwt, setJWT] = React.useState(null);

  const [isInfoTooltipPopupOpen, setisInfoTooltipPopupOpen] = React.useState(false);
  const [toolTipData, setToolTipData] = React.useState(toolTipDataFail);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isLoaderVisible, setLoaderVisible] = React.useState(true);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cardToDelete, setCardToDelete] = React.useState(null);
  const [buttonCaption, setButtonCaption] = React.useState(buttonCaptionDefault);
  const [currentUser, setCurrentUser] = React.useState({name: "Идёт загрузка...", avatar: onLoadImage, about: "", email: "example@example.com", _id: 0});
  const [cards, setCards] = React.useState([]);

  React.useEffect(() => {

    setJWT(localStorage.getItem('token'));

    Api.checkUser(jwt)
    .then((user) => {
      if(user._id && user.email){
        setIsLoggedIn(true);
        loadPage(jwt);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }, [jwt]);

  function loadPage(jwt){
    Promise.all([Api.getUserInfo(jwt), Api.getCards(jwt)])
    .then(([userData, cards]) => {
      setCurrentUser(userData);
      setCards(cards);
    })
    .catch(([userDataError, cardsError]) => {
      console.log(userDataError, cardsError);
    })
    .finally(()=>{
      setLoaderVisible(false);
    });
  }

  function toggleLogin(){
    isLoggedIn ? onSignOut(false) : setIsLoggedIn(true);
  }

  function onSignOut(value){
    localStorage.removeItem('token');
    setJWT("");
    setIsLoggedIn(value);
    closeAllPopups();
    setCurrentUser({name: "Идёт загрузка...", avatar: onLoadImage, about: "", email: "example@example.com", _id: 0});
  }

  function handleCardDelete(card){
    setCardToDelete(card);
  }

  function handleCardClick(card){
    setSelectedCard(card);
  }

  function handleEditAvatarClick(){
    setEditAvatarPopupOpen(true);
  }
  
  function handleEditProfileClick(){
    setEditProfilePopupOpen(true);
  }
  
  function handleAddPlaceClick(){
    setAddPlacePopupOpen(true);
  }

  function closeAllPopups(){
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setisInfoTooltipPopupOpen(false);
    setSelectedCard(null);
    setCardToDelete(null);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    if(isLiked){
      Api.dislikeCard(jwt, card._id)
      .then((result) => {
        setCards((state) => state.map((c) => c._id === card._id ? result : c));
      })
      .catch((error) => {
        alert(error);
      });
    }
    else{
      Api.likeCard(jwt, card._id)
      .then((result) => {
        setCards((state) => state.map((c) => c._id === card._id ? result : c));
      })
      .catch((error) => {
        alert(error);
      });
    }
  }

  function handleUpdateUser({name, about}){
    setButtonCaption({add: "Создать", delete: "Да", others: "Сохранение..."});
    Api.setUserInfo(jwt, {
      newName: name, 
      newAbout: about
    })
    .then((result) => {
      setCurrentUser(result);
      closeAllPopups();
    })
    .catch((error) => {
      alert(error);
    })
    .finally(()=>{
      setButtonCaption(buttonCaptionDefault);
    });
  }

  function handleUpdateAvatar({avatar}){
    setButtonCaption({add: "Создать", delete: "Да", others: "Сохранение..."});
    Api.setUserAvatar(jwt, avatar)
    .then((result) => {
      setCurrentUser(result);
      closeAllPopups();
    })
    .catch((error) => {
      alert(error);
    })
    .finally(()=>{
      setButtonCaption(buttonCaptionDefault);
    });
  }

  function handleAddPlaceSubmit({title, link}){
    setButtonCaption({add: "Сохранение...", delete: "Да", others: "Сохранить"});
    Api.createNewCard(jwt, {
      newTitle: title,
      newLink: link
    })
    .then((result) => {
      setCards([result, ...cards]);
      closeAllPopups();
    })
    .catch((error) => {
      alert(error);
    })
    .finally(() => {
      setButtonCaption(buttonCaptionDefault);
    });
  }

  function handleDelete(card){
    setButtonCaption({add: "Создать", delete: "Удаление...", others: "Сохранить"});
    Api.removeCard(jwt, card._id)
    .then(() => {
      setCards((state) => state.filter(c => c._id !== card._id));
      closeAllPopups();
    })
    .catch((error) => {
      alert(error);
    })
    .finally(()=>{
      setButtonCaption(buttonCaptionDefault);
    });
  }

  function onLogin({email, password}){
    Api.signIn({
      email: email, 
      password: password
    })
    .then((response) => {
      localStorage.setItem('token', response.token);
      setJWT(response.token);
      toggleLogin();
      loadPage(jwt);
    })
    .catch(() => {
      setToolTipData(toolTipDataFail);
      setisInfoTooltipPopupOpen(true);
    });
  }

  function onRegister({email, password}){
    Api.signUp({
      email: email, 
      password: password
    })
    .then(() => {
      setToolTipData(toolTipDataSuccess);
      setisInfoTooltipPopupOpen(true);
    })
    .catch(() => {
      setToolTipData(toolTipDataFail);
      setisInfoTooltipPopupOpen(true);
    });
  }

  return (
    <BrowserRouter>
      <div className="page page__content">
        <CurrentUserContext.Provider value={{currentUser: currentUser, isloggedIn: isLoggedIn, handleLogin: toggleLogin}}>
          <ProtectedRoute 
            exact path='/' component={Header} data={{showEmail: true, text: "", link: "", button: "Выйти"}} onSignOut={toggleLogin}
          />
          <ProtectedRoute 
            exact path='/' component={Main}
            cards={cards} onCardLike={handleCardLike} onCardDelete={handleCardDelete}
            onEditAvatar={handleEditAvatarClick} onEditProfile={handleEditProfileClick} 
            onAddPlace={handleAddPlaceClick} onCardClick={handleCardClick}
          />
          <ProtectedRoute 
            exact path='/' component={EditProfilePopup}
            isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} 
            onUpdateUser={handleUpdateUser} buttonCaption={buttonCaption}
          />
          <ProtectedRoute 
            exact path='/' component={AddPlacePopup}
            isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} 
            onAddPlace={handleAddPlaceSubmit} buttonCaption={buttonCaption}
          />
          <ProtectedRoute 
            exact path='/' component={EditAvatarPopup}
            isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} 
            onUpdateAvatar={handleUpdateAvatar} buttonCaption={buttonCaption}
          />
          <ProtectedRoute 
            exact path='/' component={DeleteConfirmPopup}
            card={cardToDelete} onClose={closeAllPopups} 
            onDelete={handleDelete} buttonCaption={buttonCaption}
          />
          <ProtectedRoute 
            exact path='/' component={ImagePopup}
            card={selectedCard} onClose={closeAllPopups}
          />
          <ProtectedRoute 
            exact path='/' component={Loader}
            isVisible={isLoaderVisible} image={onLoadImage}
          />
          <ProtectedRoute 
            exact path='/' component={Footer}
          />
          <Switch>
            <Route exact path="/sign-in">
              {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
              <Header data={{showEmail: false, text:"Регистрация", link: "/sign-up", button: ""}}/>
              <Login onLogin={onLogin}/>
              <InfoTooltip isOpen={isInfoTooltipPopupOpen} data={toolTipData} onClose={closeAllPopups}/>
            </Route>
            <Route exact path="/sign-up">
              {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/sign-up" />}
              <Header data={{showEmail: false, text:"Войти", link: "/sign-in", button: ""}}/>
              <Register onRegister={onRegister}/>
              <InfoTooltip isOpen={isInfoTooltipPopupOpen} data={toolTipData} onClose={closeAllPopups}/>
            </Route>
            <Route exact path="/">
              {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
            <Route path="*">
              <PageNotFound />
            </Route>
          </Switch>
        </CurrentUserContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;