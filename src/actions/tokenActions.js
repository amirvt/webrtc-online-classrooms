import {TokenAction} from '../constants/actionTypes';

export function getToken(username, roomName) {
  return (dispatch) => {
    fetch('http://local:3015/getOrCreateRoom/', {
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
      throw(e);
    });
  };
}

export function getTokenSuccess(username, roomName, token, roomId) {
  return (dispatch, getState, room) => {
    room.setupRoom({username, roomName, token, roomId});
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
