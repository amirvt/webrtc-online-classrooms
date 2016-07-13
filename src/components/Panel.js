import React, {PropTypes} from 'react';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
//import DragHandle from 'material-ui/svg-icons/editor/drag-handle';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
const Panel = props => {
  let {style, title} = props;
  style.height = "100%";
  return (
    <Paper zDepth={1} style={style}>
      <AppBar title={title} className="panel-bar" iconElementRight={<IconButton><MoreVertIcon/></IconButton>} />
      {props.children}
    </Paper>
  );
};


Panel.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object
};

Panel.defaultProps = {
  style: {}
};

export default Panel;
