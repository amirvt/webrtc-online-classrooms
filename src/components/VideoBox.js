import React, {PropTypes} from 'react';
import Panel from './Panel.js';


const VideoBox = props => {
  const {type, title} = props;
  let tag = `${type}_TAG`;
  return (
    <Panel title={title}>
      <div id={tag} style={{height: "80%"}}></div>
    </Panel>
  );
};

VideoBox.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default VideoBox;
