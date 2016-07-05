import {ScreenCamAction} from '../constants/actionTypes';

export function startScreenCam() {
  return (dispatch, getState, {room}) => {
    dispatch({type: ScreenCamAction.START});
    room.startScreenCamStream();
  };
}

export function endScreenCam() {
  return (dispatch, getState, {room}) => {
    dispatch({type: ScreenCamAction.OFF});
    room.endScreenCamStream();
  };
}

export function recvScreenCam() {
  return {type: ScreenCamAction.RECV};
}
