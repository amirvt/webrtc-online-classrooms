import {ScreenCamAction} from '../constants/actionTypes';
export default function (state = "OFF", action) {
  switch (action.type) {
    case ScreenCamAction.START:
      return "ON";
    case ScreenCamAction.RECV:
      return "RECV";
    case ScreenCamAction.OFF:
      return "OFF";
    default:
      return state;
  }
}

