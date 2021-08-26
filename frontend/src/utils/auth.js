class Auth {
  constructor({server,handleResponse}) {
    this._server = server;
    this._handleResponse = handleResponse;
    this._signIn = "/signin"; //вход
    this._signUp = "/signup"; //регистрация
    this._usersMe = "/users/me";
    this._cards = "/cards"
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

  getCards(jwt) {
    return fetch(this._server + this._cards, {
      headers: {
        "Authorization" : `Bearer ${jwt}`
      }
    })
    .then(this._handleResponse);
  }

}

export default new Auth({server: "https://api.asidaras.mesto.nomoredomains.monster", handleResponse: (res) => {
  if (!res.ok) {
    return Promise.reject(`Ошибка: ${res.status}`);
  }
  return res.json();
}});

/*
legacy
https://auth.nomoreparties.co
*/