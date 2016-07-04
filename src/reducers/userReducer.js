import {UserAction} from "../constants/actionTypes";
export default function (state = [], action) {
  switch (action.type) {
    case UserAction.ADD:
      return state.findIndex(e => e.username === action.user.username) === -1 ? [...state, action.user] : state;
    case UserAction.REMOVE:
    {
      const index = state.findIndex(e => e.username === action.user.username);
      return index >= 0 ? [...state.slice(0, index), ...state.slice(index + 1)] : state;
    }
    default:
      return state;
  }
}
