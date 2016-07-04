import React, {Component, PropTypes} from 'react';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Panel from './Panel.js';
import ChatMessages from './ChatMessages';


class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
    this.onMessageType = this.onMessageType.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
  }

  handleMessageSubmit(event) {
    event.preventDefault();
    this.props.chatActions.sendMessage(this.state.message);
  }


  onMessageType(event) {
    this.state = {message: event.target.value};
  }

  render() {
    return (
      <Panel title="Chat Area">
        <div style={{"overflowY": "scroll", height: "80%"}}>
          <ChatMessages messages={this.props.messages}/>
        </div>
        <Divider/>
        <div style={{padding: '30px', position: "absolute", bottom: 0, width: "90%"}}>
          <TextField multiLine={true} hintText="Start typing your message"
                     onChange={this.onMessageType.bind(this)}
                     style={{width: "70%"}}/>
          <FloatingActionButton mini={true}
                                style={{float: "right"}}
                                onTouchTap={this.handleMessageSubmit}
          >
            <ContentAdd />
          </FloatingActionButton>
        </div>
      </Panel>
    );
  }
}

ChatBox.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  chatActions: PropTypes.shape({
    sendMessage: PropTypes.func.isRequired
  }).isRequired
};

/*
 PropTypes.shape({
 text: PropTypes.string.isRequired,
 date: PropTypes.Object.isRequired,
 username: PropTypes.string
 })
 */

export default ChatBox;
