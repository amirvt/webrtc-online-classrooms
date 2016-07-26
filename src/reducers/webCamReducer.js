import {WebCamAction} from '../constants/actionTypes';
export default function (state = 'OFF', action) {
  switch (action.type) {
    case WebCamAction.START:
      return 'ON';
    case WebCamAction.RECV:
      return state;
    case WebCamAction.OFF:
      return 'OFF';
    default:
      return state;

  }
}
