import React, {Component, PropTypes} from 'react';

import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import VideoCam from 'material-ui/svg-icons/av/videocam';
import VideoCamOff from 'material-ui/svg-icons/av/videocam-off';
import ScreenShare from 'material-ui/svg-icons/communication/screen-share';
import StopScreenShare from 'material-ui/svg-icons/communication/stop-screen-share';
import FileUpload from 'material-ui/svg-icons/file/file-upload';
// import SlideShow from 'material-ui/svg-icons/image/slideshow'
import SpeakerNotes from 'material-ui/svg-icons/action/speaker-notes';
import SpeakerNotesOff from 'material-ui/svg-icons/action/speaker-notes-off';

export default class MyToolBar extends Component {
  constructor(props) {
    super(props);
    this._handleScreenCamTouchTap = this._handleScreenCamTouchTap.bind(this);
    this._handleWebCamTouchTap = this._handleWebCamTouchTap.bind(this);
    this._handleFile = this._handleFile.bind(this);
    this._handlePresentationButton = this._handlePresentationButton.bind(this);
  }

  _handleWebCamTouchTap(event) {
    event.preventDefault();
    const {webCamMode, webCamActions} = this.props;
    if (webCamMode === "OFF")
      webCamActions.startWebCam();
    else if (webCamMode === "ON")
      webCamActions.endWebCam();
  }

  _handleScreenCamTouchTap(event) {
    event.preventDefault();
    const {screenCamMode, screenCamActions} = this.props;
    if (screenCamMode === "OFF")
      screenCamActions.startScreenCam();
    else if (screenCamMode === "ON")
      screenCamActions.endScreenCam();
  }

  _handlePresentationButton(event) {
    event.preventDefault();
    const {presentationMode, whiteBoardActions} = this.props;
    if (presentationMode === "OFF")
      whiteBoardActions.startPresentation();
    else if (presentationMode === "ON")
      whiteBoardActions.stopPresentation();
  }

  webCamButton() {
    switch (this.props.webCamMode) {
      case "OFF":
        return (
          <IconButton tooltip="start broadcasting video" onTouchTap={this._handleWebCamTouchTap}>
            <VideoCam  />
          </IconButton> );
      case "ON":
        return (
          <IconButton tooltip="stop broadcasting video" onTouchTap={this._handleWebCamTouchTap}>
            <VideoCamOff  />
          </IconButton>);
      case "RECV":
      default:
        return (
          <IconButton disabled={true}>
            <VideoCam  />
          </IconButton> );
    }

  }

  screenShareButton() {
    switch (this.props.screenCamMode) {
      case "OFF":
        return (
          <IconButton tooltip="screen grab" onTouchTap={this._handleScreenCamTouchTap}>
            <ScreenShare  />
          </IconButton> );
      case "ON":
        return (
          <IconButton onTouchTap={this._handleScreenCamTouchTap}>
            <StopScreenShare  />
          </IconButton>);
      case "RECV":
      default:
        return (
          <IconButton disabled={true}>
            <ScreenShare  />
          </IconButton> );
    }
  }

  presentationButton() {
    switch (this.props.presentationMode) {
      case "OFF":
        return (
          <IconButton tooltip="start presentation" onTouchTap={this._handlePresentationButton}>
            <SpeakerNotes  />
          </IconButton> );
      case "ON":
        return (
          <IconButton tooltip="stop presentation" onTouchTap={this._handlePresentationButton}>
            <SpeakerNotesOff  />
          </IconButton>);
      case "RECV":
      default:
        return (
          <IconButton disabled={true}>
            <SpeakerNotes  />
          </IconButton> );
    }
  }

  _handleFile(e) {
    let file = e.target.files[0];
    if (file.size === 0) {
      alert('empty file');
      return;
    }
    this.props.whiteBoardActions.setFile(file);

  }

  uploadButton() {
    return (
      <span>
          <IconButton label="Upload file" onTouchTap={() => this._fileInput.click()} disabled={this.props.presentationMode === "RECV"}>
              <FileUpload/>
          </IconButton>
          <input
            ref={(node) => {this._fileInput = node;}}
            type="file"
            style={{"display" : "none"}}
            onChange={this._handleFile}
          />
      </span>
    );
  }

  render() {
    return (
      <Toolbar>
        <ToolbarGroup firstChild={true} float="left">
          {this.webCamButton()}
          {this.screenShareButton()}
          {this.uploadButton()}
          {this.presentationButton()}
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

MyToolBar.propTypes = {
  screenCamActions: PropTypes.object.isRequired,
  webCamActions: PropTypes.object.isRequired,
  screenCamMode: PropTypes.string.isRequired,
  webCamMode: PropTypes.string.isRequired,
  whiteBoardActions: PropTypes.object.isRequired,
  presentationMode: PropTypes.string.isRequired
};
