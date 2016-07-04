import React, {Component, PropTypes} from 'react';
import LiterallyCanvas from 'literallycanvas';
import {Toolbar} from 'material-ui/Toolbar';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import IconButton from 'material-ui/IconButton';

class WhiteBoard extends Component {
  constructor(props) {
    super(props);
    this._lc = null;
    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
  }

  nextSlide(e){
    e.preventDefault();
    let {setPage} = this.props.whiteBoardActions;
    let {pageNumber, numPages} = this.props.whiteBoardInfo;
    if (pageNumber + 1 < numPages) {
      setPage(pageNumber + 1);
    }
  }

  prevSlide(e){
    e.preventDefault();
    let {setPage} = this.props.whiteBoardActions;
    let {pageNumber} = this.props.whiteBoardInfo;
    if (pageNumber > 0) {
      setPage(pageNumber - 1);
    }
  }


  render() {
    let {images, pageNumber} = this.props.whiteBoardInfo;
    let im;
    if (images.length !== 0) {
      // return (<img src={images[pageNumber]}/>);
      im = new Image();
      im.src = images[pageNumber];
      this._lc.setWatermarkImage(im);
    }
    return (
      <div>
        <LiterallyCanvas.LiterallyCanvasReactComponent
          imageURLPrefix="public/lc"
          onInit={lc => {this._lc = lc; }}/>
        <Toolbar>

          <IconButton onTouchTap={this.prevSlide}>
            <ChevronLeft  />
          </IconButton>

          {this.props.whiteBoardInfo.pageNumber + 1} / {this.props.whiteBoardInfo.numPages}
          <IconButton onTouchTap={this.nextSlide}>
            <ChevronRight  />
          </IconButton>
        </Toolbar>
        <div style={{overflow: "hidden", position:"relative"}}>
          <canvas id="the-canvas" style={{position: "absolute", right: "-3000px"}}>
          </canvas>
        </div>
      </div>);
  }
}

WhiteBoard.propTypes = {
  whiteBoardInfo: PropTypes.shape({
    images: PropTypes.array.isRequired,
    pageNumber: PropTypes.number.isRequired
  }).isRequired,
  whiteBoardActions: PropTypes.object.isRequired
};

export default WhiteBoard;
