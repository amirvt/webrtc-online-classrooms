import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as screenCamActions from '../actions/screenCamActions';
import * as webCamActions from '../actions/webCamActions';
import * as chatActions from '../actions/chatActions';
import * as userActions from '../actions/userActions';
import * as tokenActions from '../actions/tokenActions';
import * as whiteBoardActions from '../actions/whiteBoardActions';
import Login from '../components/Login';
import MyToolBar from '../components/MyToolbar';
import UserList from '../components/UserList';
import ChatBox from '../components/ChatBox';
import {StreamType} from '../api/Room';
import VideoBox from '../components/VideoBox';
import WhiteBoard from '../components/WhiteBoard';
import {WidthProvider} from 'react-grid-layout';
let ReactGridLayout = require('react-grid-layout');
ReactGridLayout = WidthProvider(ReactGridLayout);


let layout = [
  {i: 'ul', x: 0, y: 0, w: 3, h: 6},
  {i: 'wb', x: 0, y: 6, w: 3, h: 6},
  {i: 'sb', x: 3, y: 0, w: 6, h: 12},
  {i: 'cb', x: 9, y: 0, w: 3, h: 12}
];


const MainPage = (props) => {
  let {username, roomName} = props.roomInfo;
  if (!username && !roomName)
    return (<Login getToken={props.tokenActions.getToken}/>);

  return (
    <div>
      <MyToolBar screenCamActions={props.screenCamActions}
                 webCamActions={props.webCamActions}
                 screenCamMode={props.screenCamMode}
                 webCamMode={props.webCamMode}
                 whiteBoardActions={props.whiteBoardActions}/>

      <ReactGridLayout className="layout" layout={layout}
                       cols={12} rowHeight={50} width={1200}
                       isDraggable={false} isResizable={false}>
        <div key={"ul"}>
          <UserList users={props.users}/>
        </div>
        <div key={"wb"}>
          <VideoBox title="Web Cam" type={StreamType.WEB_CAM}/>
        </div>
        <div key={"cb"}>
          <ChatBox chatActions={props.chatActions} roomInfo={props.roomInfo} messages={props.messages}/>
        </div>
        <div key={"sb"}>
          {/* <VideoBox title="Screen Capture" type={StreamType.SCREEN_CAM}/> */}
          <WhiteBoard whiteBoardInfo={props.whiteBoardInfo} whiteBoardActions={props.whiteBoardActions}/>
        </div>
      </ReactGridLayout>
    </div>
  );

};

MainPage.propTypes = {
  screenCamActions: PropTypes.object.isRequired,
  webCamActions: PropTypes.object.isRequired,
  chatActions: PropTypes.object.isRequired,
  userActions: PropTypes.object.isRequired,
  tokenActions: PropTypes.object.isRequired,
  whiteboadActions: PropTypes.object.isRequired,
  screenCamMode: PropTypes.string.isRequired,
  webCamMode: PropTypes.string.isRequired,
  roomInfo: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  whiteBoardInfo: PropTypes.object.isRequired

};

function mapStateToProps(state) {

  return {
    screenCamMode: state.screenCamMode,
    webCamMode: state.webCamMode,
    roomInfo: state.roomInfo,
    messages: state.messages,
    users: state.users,
    whiteBoardInfo: state.whiteBoardInfo
  };
}

function mapDispatchToProps(dispatch) {
  return {
    screenCamActions: bindActionCreators(screenCamActions, dispatch),
    webCamActions: bindActionCreators(webCamActions, dispatch),
    chatActions: bindActionCreators(chatActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    tokenActions: bindActionCreators(tokenActions, dispatch),
    whiteBoardActions: bindActionCreators(whiteBoardActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPage);
