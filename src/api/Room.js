import {endScreenCam, recvScreenCam} from '../actions/screenCamActions';
import {recvWebCam, endWebCam} from '../actions/webCamActions';
import {addUser, removeUser} from '../actions/userActions';
import {addMessage} from '../actions/chatActions';
import {setFileB64, setPageLocal, setSnapShotLocal} from '../actions/whiteBoardActions';

export const StreamType = {
  WEB_CAM: "WEB_CAM",
  SCREEN_CAM: "SCREEN_CAM",
  CHAT: "CHAT"
};

export default class Room {
  constructor() {
    this._room = null;
    this._roomInfo = null;
    this._webCamStream = null;
    this._screenCamStream = null;
    this._chatStream = null;
    this._dispatch = null;
  }

  setDispatch(disptch) {
    this._dispatch = disptch;
  }

  _subscribeToStreams(streams) {
    for (let stream of streams) {
      let {username, type} = stream.getAttributes();
      if (username !== this._roomInfo.username) {
        this._room.subscribe(stream);
        if (type == StreamType.CHAT)
          this._addUser(username);
      }
    }
  }

  _initChatStream() {
    this._chatStream = Erizo.Stream({
      audio: false,
      video: false,
      data: true,
      screen: false,
      attributes: {type: StreamType.CHAT, username: this._roomInfo.username}
    });
    this._chatStream.init();
  }

  setupRoom(roomInfo) {
    this._roomInfo = roomInfo;
    this._room = Erizo.Room({
      token: this._roomInfo.token
    });

    this._room.connect();

    this._initChatStream();

    this._room.addEventListener("room-connected", roomEvent => {
      this._room.publish(this._chatStream);
      this._subscribeToStreams(roomEvent.streams);
    });

    this._room.addEventListener('stream-added', streamEvent => {
      let streams = [];
      streams.push(streamEvent.stream);
      this._subscribeToStreams(streams);
    });

    this._room.addEventListener('stream-removed', streamEvent => {

      let stream = streamEvent.stream;

      //TODO generalize
      let {type, username} = stream.getAttributes();
      if (username !== this._roomInfo.username && (type === StreamType.SCREEN_CAM || type === StreamType.WEB_CAM)) {
        this._dispatchEndVideoStream(type);
      } else if (type === StreamType.CHAT) {
        this._removeUser(username);
      }
    });

    this._room.addEventListener('stream-subscribed', streamEvent => {
      let stream = streamEvent.stream;
      let {type} = stream.getAttributes();

      if (type === StreamType.SCREEN_CAM || type === StreamType.WEB_CAM) {
        this._recvVideoStream(type);
        stream.play(`${type}_TAG`);
      } else if (type === StreamType.CHAT) {
        stream.addEventListener('stream-data', event => {
          let {username, type} = event.stream.getAttributes();
          if (type === StreamType.CHAT) {
            if (event.msg.type === "CHAT")
              this._addMessage(event.msg, username);
            else if (event.msg.type === "FILE") {
              this._setFile(event.msg.b64String);
            } else if (event.msg.type === "PAGE_NUMBER") {
              this._dispatch(setPageLocal(event.msg.pageNumber));
            } else if (event.msg.type === "SNAPSHOT") {
              this._dispatch(setSnapShotLocal(event.msg.snapShot));
            }
          }
        });
      }
    });
  }

  startWebCamStream() {
    this._startVideoStream(StreamType.WEB_CAM);
  }

  startScreenCamStream() {
    this._startVideoStream(StreamType.SCREEN_CAM);
  }

  _startVideoStream(type) {
    let stream = Erizo.Stream({
      video: type === StreamType.WEB_CAM,
      audio: type === StreamType.WEB_CAM,
      screen: type === StreamType.SCREEN_CAM,
      data: false,
      attributes: {
        type,
        username: this._roomInfo.username
      }
    });

    if (type === StreamType.SCREEN_CAM)
      this._screenCamStream = stream;
    else
      this._webCamStream = stream;
    stream.init();
    stream.addEventListener('access-accepted', () => {
      stream.play(`${type}_TAG`, {crop: true});
      this._room.publish(stream);
    });
    stream.addEventListener('access-denied', () => {
      alert("access denied");
      this._dispatchEndVideoStream(type);
    });
  }

  endWebCamStream() {
    if (this._webCamStream) {
      this._webCamStream.stop();
      this._webCamStream.close();
      this._webCamStream = null;
    }
  }

  endScreenCamStream() {
    if (this._screenCamStream) {
      this._screenCamStream.stop();
      this._screenCamStream.close();
      this._screenCamStream = null;
    }
  }

  sendMessage(text) {
    this._chatStream.sendData({
      text,
      type: "CHAT"
    });
  }

  syncFile(b64String) {
    this._chatStream.sendData({
      b64String,
      type: "FILE"
    });
  }

  sendSetPage(pageNumber) {
    this._chatStream.sendData({
      pageNumber,
      type: "PAGE_NUMBER"
    });
  }

  syncSnapShot(snapShot) {
    this._chatStream.sendData({
      snapShot,
      type: "SNAPSHOT"
    });
  }

  _dispatchEndVideoStream(type) {
    if (type === StreamType.WEB_CAM) {
      this._dispatch(endWebCam());
    } else if (type === StreamType.SCREEN_CAM) {
      this._dispatch(endScreenCam());
    }
  }

  _addMessage(msg, username) {
    this._dispatch(addMessage({...msg, username}));
  }

  _removeUser(username) {
    this._dispatch(removeUser(username));
  }

  _addUser(username) {
    this._dispatch(addUser(username));
  }

  _recvVideoStream(type) {
    if (type === StreamType.WEB_CAM) {
      this._dispatch(recvWebCam());
    } else if (type === StreamType.SCREEN_CAM) {
      this._dispatch(recvScreenCam());
    }
  }

  _setFile(b64String) {
    this._dispatch(setFileB64(b64String));
  }
}
