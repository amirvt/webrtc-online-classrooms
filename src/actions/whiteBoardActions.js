import {WhiteBoardAction} from '../constants/actionTypes';
import pdfjs from 'pdfjs-dist-for-node';


export function setSnapShot(snapShot){
  return (dispatch, getState, room) => {
    room.syncSnapShot(snapShot);
  };
}

export function setSnapShotLocal(snapShot){
  return {
    snapShot,
    type: WhiteBoardAction.SET_SHAPES
  };
}

export function setPage(pageNumber) {
  return (dispatch, getState, room) =>{
    room.sendSetPage(pageNumber);
    dispatch(setPageLocal(pageNumber));
  };
}

export function setPageLocal(pageNumber){
  return {
    type: WhiteBoardAction.SET_PAGE,
    pageNumber
  };
}


export function resetPage(numPages) {
  return {
    type: WhiteBoardAction.RESET_PAGE,
    numPages
  };
}

const _extractImagesFromPdf = function (pdfDataObject, dispatch) {
  pdfjs.getDocument(pdfDataObject).then(function (pdf) {
    dispatch(resetPage(pdf.numPages));
    let imageDatas = [];
    for (let i = 1; i <= pdf.numPages; i++) {

      pdf.getPage(i).then(function (page) {
        let scale = 1;
        let viewport = page.getViewport(scale);

        let canvas = document.getElementById('the-canvas');
        let context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height = viewport.height;
        canvas.width = viewport.width;


        let task = page.render({canvasContext: context, viewport: viewport});
        task.promise.then(function () {
          let imageData = canvas.toDataURL();
          imageDatas.push(imageData);

        }, function (e) {
          throw(e);
        }).then(function () {
          dispatch(setImages(imageDatas));
        });

      });
    }

  }, function (e) {
    throw(e);
  });
};

export function setFile(file) {
  return dispatch => {
    dispatch(pdfConvertStart);
    dispatch(syncFile(file));
    let fileReader = new FileReader();
    fileReader.onload = function () {
      let result = fileReader.result;
      _extractImagesFromPdf(result, dispatch);
    };
    fileReader.readAsArrayBuffer(file);
  };
}

function _arrayBufferToBase64(buffer) {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function syncFile(file) {
  return (dispatch, getState, room) => {
    let fileReader = new FileReader();
    fileReader.onload = function () {
      let result = fileReader.result;
      const b64String = _arrayBufferToBase64(result);
      room.syncFile(b64String);
    };
    fileReader.readAsArrayBuffer(file);
  };
}


function convertDataURIToBinary(b64String) {

  let raw = window.atob(b64String);
  let rawLength = raw.length;
  let array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

export function setFileB64(b64String) {
  return (dispatch) => {
    let pdfAsArray = convertDataURIToBinary(b64String);
    _extractImagesFromPdf(pdfAsArray, dispatch);
  };


}

export function setImages(images) {
  return {
    type: WhiteBoardAction.SET_IMAGES,
    images
  };
}

export function pdfConvertStart() {
  return {
    type: WhiteBoardAction.PDF_START
  };
}
