import Panel from './Panel.js';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import {List, ListItem} from 'material-ui/List';
import React, {PropTypes} from 'react';

function renderUsers(props) {
  return props.users.map((user, index) => (<ListItem key={index} primaryText={user.username}
                                            rightIcon={<CommunicationChatBubble/>}/>));
}

const UserList = props => (
  <Panel title="Current Users" style={{margin: "0px"}}>
    <div style={{"overflowY": "scroll", height: "80%"}}>
      <List >
        {renderUsers(props)}
      </List>
    </div>
  </Panel>
);

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired
  }))
};

export default UserList;
