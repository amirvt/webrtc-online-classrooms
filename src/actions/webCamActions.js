import {WebCamAction} from '../constants/actionTypes';



export function startWebCam() {
  return (dispatch, getState, {room}) =>  {
    dispatch({type: WebCamAction.START});
    room.startWebCamStream();
  };
}

export function endWebCam() {
  return (dispatch, getState, {room}) => {
    dispatch( {type: WebCamAction.OFF});
    room.endWebCamStream();
  };

}

export function recvWebCam() {
  return {type: WebCamAction.RECV};
}
