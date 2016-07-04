import {UserAction} from '../constants/actionTypes';

export function addUser(username) {
  return {
    type: UserAction.ADD,
    user: {
      username
    }
  };
}

export function removeUser(user) {
  return {
    type: UserAction.REMOVE,
    user
  };
}
