import React from 'react';
import { Link } from 'react-router-dom';

function Register({onRegister}) {

  const emailRef = React.useRef();
  const passwordRef = React.useRef();

  function handleSubmit(event){
    event.preventDefault();

    onRegister({
      email: emailRef.current.value, 
      password: passwordRef.current.value
    });
  }

  return (
    <section className="auth">
      <h2 className="auth__header">Регистрация</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input 
          className="auth__input" placeholder="Email" type="email" ref={emailRef}
        />
        <input 
          className="auth__input" placeholder="Пароль" type="password" ref={passwordRef}
        />
        <button className="auth__submit-button">Зарегистрироваться</button>
      </form>
      <span className="auth__caption">
        Уже зарегистрированы?&ensp;
        <Link className="auth__caption auth__caption_type_link" to="/sign-in">
          Войти
        </Link>
      </span>
    </section>
  );
}

export default Register;