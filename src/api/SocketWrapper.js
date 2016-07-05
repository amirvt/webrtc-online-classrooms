import {SocketEvent} from '../../server/serverconstants';
import {} from '../actions/whiteBoardActions';

export default class SocketWrapper {
  constructor() {
    this._roomName = null;
    this._dispatch = null;
    this._socket = null;
  }

  setDispatch(dispatch) {
    this._dispatch = dispatch;
  }

  init(roomName, username) {
    this._roomName = roomName;
    this._username = username;
    this._socket = io.connect('http:localhost/3015');
    this._socket.on('connect', function () {
      this._socket.emit(SocketEvent.JOIN_ROOM, roomName, username);
    });
    this._socket.on(SocketEvent.ROOM_INFO, function (info) {
      info = JSON.parse(info);
      this._dispatchSetInfo(info);
    });
    this._socket.on(SocketEvent.REJECT_PRESENTER, function () {
      this._dispatchRejectPresenter();
    });
    this._socket.on(SocketEvent.PRESENTATION_START, function (username) {
      this._dispatchPresentationStart(username);
    });
    this._socket.on(SocketEvent.PRESENTATION_STOP, function () {
      this._dispatchPresentationStop();
    });
    this._socket.on(SocketEvent.SET_SNAPSHOT, function (snapShot) {
      this._dispatchSetSnapShot(snapShot);
    });
    this._socket.on(SocketEvent.SET_PDF_FILE, function (pdfFile) {
      this._dispatchSetPdfFile(pdfFile);
    });
  }

  _dispatchRejectPresenter() {

  }

  _dispatchPresentationStart(username) {

  }

  _dispatchPresentationStop() {

  }

  _dispatchSetSnapShot(snapShot) {

  }

  _dispatchSetPdfFile(pdfFile) {

  }

  _dispatchSetInfo(info) {

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
    this._socket.empty(SocketEvent.SET_SNAPSHOT, snapShotJson);
  }
}
