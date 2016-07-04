import React, {PropTypes} from 'react';
import {List, ListItem} from 'material-ui/List';
import * as Colors from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';

const ChatMessages = props => (
  <List >
    {props.messages.map((msg, index) =>
      (
        <div key={index}>
          <ListItem
            primaryText={msg.date.toLocaleTimeString()}
            secondaryText={
                                        <p>
                                            <span style={{color: Colors.darkBlack}}>{msg.username}</span> -- {" "}
                                            {msg.text}
                                        </p>
                                    }
            secondaryTextLines={1}
          />
          <Divider/>
        </div>
      )
    )}
  </List>
);

ChatMessages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ChatMessages;
