import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      roomName: ""
    };
  }

  handleChange(event) {
    this.state = {...this.state, username: event.target.value};
  }

  handleMeetingChange(event) {
    this.state = {...this.state, roomName: event.target.value};
  }

  handleSubmit() {
    this.props.getToken(this.state.username, this.state.roomName);
  }

  render() {
    return (
      <div>
        <TextField hintText="Username" onChange={this.handleChange.bind(this)}/>
        <br/>
        <TextField hintText="Room Name" onChange={this.handleMeetingChange.bind(this)}/>
        <br/>
        <FlatButton
          label="Submit"
          primary={true}
          onTouchTap={this.handleSubmit.bind(this)}
        />
      </div>
    );
  }
}

Login.propTypes = {
  getToken: PropTypes.func.isRequired
};

export default Login;

