import {TokenAction} from '../constants/actionTypes';

export default function(state={username: "", roomName: "", token: ""}, action){
  switch (action.type){
    case TokenAction.SUCCESS: {
      let roomInfo = action.roomInfo;
      return {...roomInfo};
    }
    default:
          return state;
  }
}
