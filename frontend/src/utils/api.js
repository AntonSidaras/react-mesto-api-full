class Api {
  constructor({server,handleResponse}) {
    this._server = server;
    this._handleResponse = handleResponse;
    this._signIn = "/signin"; //вход
    this._signUp = "/signup"; //регистрация
    this._usersMe = "/users/me";
    this._avatar = "/users/me/avatar";
    this._cards = "/cards";
    this._likes = "/likes";
    this._contentType = "application/json";
  }

  signUp({email, password}){
    return fetch(this._server + this._signUp, {
      method: "POST",
      headers: {
        "Content-Type": this._contentType
      },
      body: JSON.stringify({
        "password": password,
        "email": email
      })
    })
    .then(this._handleResponse);
  }
  
  signIn({email, password}){
    return fetch(this._server + this._signIn, {
      method: "POST",
      headers: {
        "Content-Type": this._contentType
      },
      body: JSON.stringify({
        "password": password,
        "email": email
      })
    })
    .then(this._handleResponse);
  }

  checkUser(jwt){
    return fetch(this._server + this._usersMe, {
      method: "GET",
      headers: {
        "Content-Type": this._contentType,
        "Authorization" : `Bearer ${jwt}`
      }
    })
    .then(this._handleResponse);
  }

  getUserInfo(jwt) {
    return fetch(this._server + this._usersMe, {
      headers: {
        "Authorization" : `Bearer ${jwt}`
      }
    })
    .then(this._handleResponse);
  }

  setUserInfo(jwt, {newName, newAbout}){
    return fetch(this._server + this._usersMe, {
      method: "PATCH",
      headers: {
        "Authorization" : `Bearer ${jwt}`,
        "Content-Type": this._contentType
      },
      body: JSON.stringify({
        name: newName,
        about: newAbout
      })
    })
    .then(this._handleResponse);
  }

  setUserAvatar(jwt, userAvatar){
    return fetch(this._server + this._avatar, {
      method: "PATCH",
      headers: {
        "Authorization" : `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: userAvatar
      })
    })
    .then(this._handleResponse);
  }

  createNewCard(jwt, {newTitle, newLink}){
    return fetch(this._server + this._cards, {
      method: "POST",
      headers: {
        "Authorization" : `Bearer ${jwt}`,
        "Content-Type": this._contentType
      },
      body: JSON.stringify({
        name: newTitle,
        link: newLink
      })
    })
    .then(this._handleResponse);
  }

  getCards(jwt) {
    return fetch(this._server + this._cards, {
      headers: {
        "Authorization" : `Bearer ${jwt}`
      }
    })
    .then(this._handleResponse);
  }

  likeCard(jwt, cardId){
    return fetch(this._server + this._cards + "/" + cardId + this._likes, {
      method: "PUT",
      headers: {
        "Authorization" : `Bearer ${jwt}`,
      }
    })
    .then(this._handleResponse);
  }

  dislikeCard(jwt, cardId){
    return fetch(this._server + this._cards + "/" + cardId + this._likes, {
      method: "DELETE",
      headers: {
        "Authorization" : `Bearer ${jwt}`,
      }
    })
    .then(this._handleResponse);
  }

  removeCard(jwt, cardId){
    return fetch(this._server + this._cards + "/" + cardId, {
      method: "DELETE",
      headers: {
        "Authorization" : `Bearer ${jwt}`
      }
    })
    .then(this._handleResponse);
  }

}

export default new Api({server: "https://api.asidaras.mesto.nomoredomains.monster", handleResponse: (res) => {
  if (!res.ok) {
    return Promise.reject(`Ошибка: ${res.status}`);
  }
  return res.json();
}});