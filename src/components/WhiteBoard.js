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
    this._lcDrawEventUnSub = () => {};
    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
    this._lcInit = this._lcInit.bind(this);
  }

  nextSlide(e) {
    e.preventDefault();
    let {setPage} = this.props.whiteBoardActions;
    let {pageNumber, numPages} = this.props.whiteBoardInfo;
    if (pageNumber + 1 < numPages) {
      setPage(pageNumber + 1);
    }
  }

  prevSlide(e) {
    e.preventDefault();
    let {setPage} = this.props.whiteBoardActions;
    let {pageNumber} = this.props.whiteBoardInfo;
    if (pageNumber > 0) {
      setPage(pageNumber - 1);
    }
  }



  _lcInit(lc) {
    this._lc = lc;
  }



  render() {

    let {images, pageNumber, presentationMode, snapShot, numPages} = this.props.whiteBoardInfo;
    let im;
    if (images.length !== 0) {
      // return (<img src={images[pageNumber]}/>);
      im = new Image();
      im.src = images[pageNumber];
      this._lc.setWatermarkImage(im);
    }

    if(presentationMode === "ON" && this._lc) {
      const {setSnapShot} = this.props.whiteBoardActions;
      this._lcDrawEventUnSub();
      //setSnapShot(JSON.stringify(this._lc.getSnapshot(['shapes'])));
      this._lcDrawEventUnSub = this._lc.on('drawingChange', () => {
        setSnapShot(JSON.stringify(this._lc.getSnapshot(['shapes'])));
      });

    }

    if (this._lc && snapShot && presentationMode === "RECV") {
      this._lc.loadSnapshot(JSON.parse(snapShot));
    }


    return (
      <div>
        <LiterallyCanvas.LiterallyCanvasReactComponent
          imageURLPrefix="public/lc"
          onInit={this._lcInit}
          snapshot={snapShot ? JSON.parse(snapShot) : {}}/>
        <Toolbar>

          <IconButton onTouchTap={this.prevSlide}>
            <ChevronLeft  disabled={presentationMode === "RECV"} />
          </IconButton>

          {pageNumber + 1} / {numPages}
          <IconButton onTouchTap={this.nextSlide}>
            <ChevronRight disabled={presentationMode === "RECV"} />
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
    pageNumber: PropTypes.number.isRequired,
    numPages: PropTypes.number.isRequired,
    snapShot: PropTypes.string,
    presentationMode: PropTypes.string
  }).isRequired,
  whiteBoardActions: PropTypes.object.isRequired
};

export default WhiteBoard;
