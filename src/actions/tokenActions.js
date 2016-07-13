import {TokenAction} from '../constants/actionTypes';
const  SERVER_IP = require('../constants/serverconstants').SERVER_IP;
export function getToken(username, roomName) {
  return (dispatch) => {
    fetch(`${SERVER_IP}/getOrCreateRoom/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'default',
      body: JSON.stringify({
        username,
        roomName,
        role: "presenter"
      })
    }).then(res => {
        return res.json();
      }
    ).then(data => {
      dispatch(getTokenSuccess(username, roomName, data.token, data.roomId));
    }).catch(e => {
      alert(e);
    });
  };
}

export function getTokenSuccess(username, roomName, token, roomId) {
  return (dispatch, getState, {room, socketWrapper}) => {
    room.setupRoom({username, roomName, token, roomId});
    socketWrapper.setUpSocket(roomName, username);
    dispatch({
      type: TokenAction.SUCCESS,
      roomInfo: {
        username,
        roomName,
        token,
        roomId
      }
    });
  };
}
