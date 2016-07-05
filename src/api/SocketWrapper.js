import {SocketEvent} from '../../server/serverconstants';
import {setWhiteBoardInfo, stopPresentationSuccess, setSnapShotLocal, setPdfFileB64, startPresentationSuccess, setPageLocal, startPresentationReject} from '../actions/whiteBoardActions';
import io from 'socket.io-client';


export default class SocketWrapper {
  constructor() {
    this._roomName = null;
    this._dispatch = null;
    this._socket = null;
  }

  setDispatch(dispatch) {
    this._dispatch = dispatch;
  }

  setUpSocket(roomName, username) {
    this._roomName = roomName;
    this._username = username;
    this._socket = io('http://localhost:3015');
    this._socket.on('connect',  () => {
      this._socket.emit(SocketEvent.JOIN_ROOM, roomName, username);
    });
    this._socket.on(SocketEvent.ROOM_INFO, (info) => {
      info = JSON.parse(info);
      if (info)
        this._dispatchSetInfo(info);
    });
    this._socket.on(SocketEvent.REJECT_PRESENTER, () => {
      this._dispatchRejectPresenter();
    });
    this._socket.on(SocketEvent.PRESENTATION_START, (username) => {
      this._dispatchPresentationStart(username);
    });
    this._socket.on(SocketEvent.ACCEPT_PRESENTER, () => {
      this._dispatchPresentationStart();
    });
    this._socket.on(SocketEvent.PRESENTATION_STOP, () => {
      this._dispatchPresentationStop();
    });
    this._socket.on(SocketEvent.SET_SNAPSHOT, (snapShot) => {
      this._dispatchSetSnapShot(snapShot);
    });
    this._socket.on(SocketEvent.SET_PDF_FILE, (pdfFile) => {
      this._dispatchSetPdfFile(pdfFile);
    });
    this._socket.on(SocketEvent.SET_PAGE, (pageNumber) => {
      this._dispatchSetPage(pageNumber);
    });
  }

  _dispatchSetPage(pageNumber) {
    this._dispatch(setPageLocal(pageNumber));
  }

  _dispatchRejectPresenter() {
    this._dispatch(startPresentationReject());
  }

  _dispatchPresentationStart(username=null) {
    this._dispatch(startPresentationSuccess(username));
  }

  _dispatchPresentationStop() {
    this._dispatch(stopPresentationSuccess());
  }

  _dispatchSetSnapShot(snapShot) {
    this._dispatch(setSnapShotLocal(snapShot));
  }

  _dispatchSetPdfFile(b64String) {
    this._dispatch(setPdfFileB64(b64String));
  }

  _dispatchSetInfo(info) {
    this._dispatch(setWhiteBoardInfo(info));
  }

  reqPresenter() {
    this._socket.emit(SocketEvent.REQ_PRESENTER);
  }

  stopPresenter() {
    this._socket.emit(SocketEvent.STOP_PRESENTER);
  }

  syncPdfFile(b64String) {
    this._socket.emit(SocketEvent.SET_PDF_FILE, b64String);
  }

  syncSnapShot(snapShotJson) {
    this._socket.emit(SocketEvent.SET_SNAPSHOT, snapShotJson);
  }

  syncPageNumber(pageNumber){
    this._socket.emit(SocketEvent.SET_PAGE, pageNumber);
  }


}
