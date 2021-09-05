import onLoadImage from "../images/profile/Card-load.gif";
import onFailureAuth from "../images/popup/fail.svg"
import onSuccessAuth from "../images/popup/ok.svg"

export const ROUTE_ANY = "*";
export const ROUTE_ROOT = "/";
export const ROUTE_SIGN_IN = "/sign-in";
export const ROUTE_SIGN_UP = "/sign-up";
export const TOKEN_STRING_KEY = 'token';
export const DEFAULT_USER = {name: "Идёт загрузка...", avatar: onLoadImage, about: "", email: "example@example.com", _id: 0};
export const DEFAULT_BUTTON_CAPTION = {add: "Создать", delete: "Да", others: "Сохранить"};
export const TOOL_TIP_DATA_FAIL = {image: onFailureAuth, text:"Что-то пошло не так! Попробуйте ещё раз."};
export const TOOL_TIP_DATA_SUCCESS = {image: onSuccessAuth, text:"Вы успешно зарегистрировались!"};
export const BUTTON_CAPTION_UPDATE_USER_AVATAR = {add: "Создать", delete: "Да", others: "Сохранение..."};
export const BUTTON_CAPTION_DELETE_CARD = {add: "Создать", delete: "Удаление...", others: "Сохранение..."};
export const BUTTON_CAPTION_ADD_CARD = {add: "Сохранение...", delete: "Да", others: "Сохранить"}
export const HEADER_AUTHORIZED = {showEmail: true, text: "", link: "", button: "Выйти"};
export const HEADER_LINK_TO_SIGN_IN = {showEmail: false, text:"Войти", link: ROUTE_SIGN_IN, button: ""};
export const HEADER_LINK_TO_SIGN_UP = {showEmail: false, text:"Регистрация", link: ROUTE_SIGN_UP, button: ""};