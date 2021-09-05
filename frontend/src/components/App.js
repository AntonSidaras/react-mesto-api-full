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
import * as Constants from '../utils/constants';
import onLoadImage from "../images/profile/Card-load.gif"
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function App() {

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [jwt, setJWT] = React.useState(null);

  const [isInfoTooltipPopupOpen, setisInfoTooltipPopupOpen] = React.useState(false);
  const [toolTipData, setToolTipData] = React.useState(Constants.TOOL_TIP_DATA_FAIL);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isLoaderVisible, setLoaderVisible] = React.useState(true);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cardToDelete, setCardToDelete] = React.useState(null);
  const [buttonCaption, setButtonCaption] = React.useState(Constants.DEFAULT_BUTTON_CAPTION);
  const [currentUser, setCurrentUser] = React.useState(Constants.DEFAULT_USER);
  const [cards, setCards] = React.useState([]);

  React.useEffect(() => {

    setJWT(localStorage.getItem(Constants.TOKEN_STRING_KEY));

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
    localStorage.removeItem(Constants.TOKEN_STRING_KEY);
    setJWT("");
    setIsLoggedIn(value);
    closeAllPopups();
    setCurrentUser(Constants.DEFAULT_USER);
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
    setButtonCaption(Constants.BUTTON_CAPTION_UPDATE_USER_AVATAR);
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
      setButtonCaption(Constants.DEFAULT_BUTTON_CAPTION);
    });
  }

  function handleUpdateAvatar({avatar}){
    setButtonCaption(Constants.BUTTON_CAPTION_UPDATE_USER_AVATAR);
    Api.setUserAvatar(jwt, avatar)
    .then((result) => {
      setCurrentUser(result);
      closeAllPopups();
    })
    .catch((error) => {
      alert(error);
    })
    .finally(()=>{
      setButtonCaption(Constants.DEFAULT_BUTTON_CAPTION);
    });
  }

  function handleAddPlaceSubmit({title, link}){
    setButtonCaption(Constants.BUTTON_CAPTION_ADD_CARD);
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
      setButtonCaption(Constants.DEFAULT_BUTTON_CAPTION);
    });
  }

  function handleDelete(card){
    setButtonCaption(Constants.BUTTON_CAPTION_DELETE_CARD);
    Api.removeCard(jwt, card._id)
    .then(() => {
      setCards((state) => state.filter(c => c._id !== card._id));
      closeAllPopups();
    })
    .catch((error) => {
      alert(error);
    })
    .finally(()=>{
      setButtonCaption(Constants.DEFAULT_BUTTON_CAPTION);
    });
  }

  function onLogin({email, password}){
    Api.signIn({
      email: email, 
      password: password
    })
    .then((response) => {
      localStorage.setItem(Constants.TOKEN_STRING_KEY, response.token);
      setJWT(response.token);
      toggleLogin();
      loadPage(jwt);
    })
    .catch(() => {
      setToolTipData(Constants.TOOL_TIP_DATA_FAIL);
      setisInfoTooltipPopupOpen(true);
    });
  }

  function onRegister({email, password}){
    Api.signUp({
      email: email, 
      password: password
    })
    .then(() => {
      setToolTipData(Constants.TOOL_TIP_DATA_SUCCESS);
      setisInfoTooltipPopupOpen(true);
    })
    .catch(() => {
      setToolTipData(Constants.TOOL_TIP_DATA_FAIL);
      setisInfoTooltipPopupOpen(true);
    });
  }

  return (
    <BrowserRouter>
      <div className="page page__content">
        <CurrentUserContext.Provider value={{currentUser: currentUser, isloggedIn: isLoggedIn, handleLogin: toggleLogin}}>
          <ProtectedRoute 
            exact path={Constants.ROUTE_ROOT} component={Header} data={Constants.HEADER_AUTHORIZED} onSignOut={toggleLogin}
          />
          <ProtectedRoute 
            exact path={Constants.ROUTE_ROOT} component={Main}
            cards={cards} onCardLike={handleCardLike} onCardDelete={handleCardDelete}
            onEditAvatar={handleEditAvatarClick} onEditProfile={handleEditProfileClick} 
            onAddPlace={handleAddPlaceClick} onCardClick={handleCardClick}
          />
          <ProtectedRoute 
            exact path={Constants.ROUTE_ROOT} component={EditProfilePopup}
            isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} 
            onUpdateUser={handleUpdateUser} buttonCaption={buttonCaption}
          />
          <ProtectedRoute 
            exact path={Constants.ROUTE_ROOT} component={AddPlacePopup}
            isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} 
            onAddPlace={handleAddPlaceSubmit} buttonCaption={buttonCaption}
          />
          <ProtectedRoute 
            exact path={Constants.ROUTE_ROOT} component={EditAvatarPopup}
            isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} 
            onUpdateAvatar={handleUpdateAvatar} buttonCaption={buttonCaption}
          />
          <ProtectedRoute 
            exact path={Constants.ROUTE_ROOT} component={DeleteConfirmPopup}
            card={cardToDelete} onClose={closeAllPopups} 
            onDelete={handleDelete} buttonCaption={buttonCaption}
          />
          <ProtectedRoute 
            exact path={Constants.ROUTE_ROOT} component={ImagePopup}
            card={selectedCard} onClose={closeAllPopups}
          />
          <ProtectedRoute 
            exact path={Constants.ROUTE_ROOT} component={Loader}
            isVisible={isLoaderVisible} image={onLoadImage}
          />
          <ProtectedRoute 
            exact path={Constants.ROUTE_ROOT} component={Footer}
          />
          <Switch>
            <Route exact path={Constants.ROUTE_SIGN_IN}>
              {isLoggedIn ? <Redirect to={Constants.ROUTE_ROOT} /> : <Redirect to={Constants.ROUTE_SIGN_IN} />}
              <Header data={Constants.HEADER_LINK_TO_SIGN_UP}/>
              <Login onLogin={onLogin}/>
              <InfoTooltip isOpen={isInfoTooltipPopupOpen} data={toolTipData} onClose={closeAllPopups}/>
            </Route>
            <Route exact path={Constants.ROUTE_SIGN_UP}>
              {isLoggedIn ? <Redirect to={Constants.ROUTE_ROOT} /> : <Redirect to={Constants.ROUTE_SIGN_UP} />}
              <Header data={Constants.HEADER_LINK_TO_SIGN_IN}/>
              <Register onRegister={onRegister}/>
              <InfoTooltip isOpen={isInfoTooltipPopupOpen} data={toolTipData} onClose={closeAllPopups}/>
            </Route>
            <Route exact path={Constants.ROUTE_ROOT}>
              {isLoggedIn ? <Redirect to={Constants.ROUTE_ROOT} /> : <Redirect to={Constants.ROUTE_SIGN_IN} />}
            </Route>
            <Route path={Constants.ROUTE_ANY}>
              <PageNotFound />
            </Route>
          </Switch>
        </CurrentUserContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;