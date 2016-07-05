import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import SocketWrapper from "../api/SocketWrapper";
import Room from "../api/Room";
import thunk from 'redux-thunk';

const socketWrapper = new SocketWrapper();
const room = new Room();


export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState,
    applyMiddleware(thunk.withExtraArgument({room, socketWrapper}))
  );
  room.setDispatch(store.dispatch);
  socketWrapper.setDispatch(store.dispatch);
  return store;
}
