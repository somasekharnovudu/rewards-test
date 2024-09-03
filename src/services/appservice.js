// import axios from 'axios';
// import { API_URL } from '../config.constants';
import userData from '../data/db.json';

// For actual API & need to run start-api command to run json-sevrer
// export const getUserList = () => axios.get(API_URL + '/users').then((resp) => resp).catch((err) => ({ err }))
// export const getUserData = (userid) => axios.get(API_URL + '/users/' + userid).then((resp) => resp).catch((err) => ({ err }))

// Mock the data and return it as promise(async)
export const getUserList = async () => ({ data: userData.users })

export const getUserData = async (userid) => ({ data: userData.users.find((userObj) => userObj.id === userid) })