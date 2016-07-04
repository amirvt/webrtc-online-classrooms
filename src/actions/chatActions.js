import {ADD_MESSAGE} from '../constants/actionTypes';

export function addMessage(message){
  return {
    type: ADD_MESSAGE,
    message:{...message, date: new Date()}
  };
}

export function sendMessage(text){
  return (dispatch, getState, room) => {
    room.sendMessage(text);
    dispatch(addMessage({text}));
  };
}
