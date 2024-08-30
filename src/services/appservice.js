import axios from "axios";
import { API_URL } from "../config.constants";

export const getUserList = () =>
  axios
    .get(API_URL + "/users")
    .then((resp) => resp.data)
    .catch((err) => ({ err }));

export const getUserData = (userid) =>
  axios
    .get(API_URL + "/users/" + userid)
    .then((resp) => resp)
    .catch((err) => ({ err }));
