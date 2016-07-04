import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import roomInfo from './tokenReducer';
import screenCamMode from './screenCamReducer';
import webCamMode from './webCamReducer';
import users from './userReducer';
import messages from './chatReducer';
import whiteBoardInfo from './whiteBoardReducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  screenCamMode,
  webCamMode,
  roomInfo,
  messages,
  users,
  whiteBoardInfo
});

export default rootReducer;
