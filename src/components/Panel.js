import React, {PropTypes} from 'react';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

const Panel = props => {
  let {style, title} = props;
  style.height = "100%";
  return (
    <Paper zDepth={1} style={style}>
      <AppBar title={title}/>
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
