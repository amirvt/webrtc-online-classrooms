import {ADD_MESSAGE} from '../constants/actionTypes';
export default function (state = [], action) {
  if (action.type === ADD_MESSAGE) {
    return [...state, action.message];
  } else return state;
}
