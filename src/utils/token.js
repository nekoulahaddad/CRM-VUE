import Cookies from "js-cookie";
import { AUTH_TOKEN } from "../constants";

export default class Token {
  static get() {
    return Cookies.get(AUTH_TOKEN);
  }

  static set(value) {
    return Cookies.set(AUTH_TOKEN, value);
  }

  static remove() {
    return Cookies.remove(AUTH_TOKEN);
  }
}
