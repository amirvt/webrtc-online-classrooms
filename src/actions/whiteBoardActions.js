import {WhiteBoardAction} from '../constants/actionTypes';
import pdfjs from 'pdfjs-dist-for-node';

export function setWhiteBoardInfo(info) {
  return dispatch => {
    let {pdfFile, pageNumber, snapShot, presenter} = info;
    if (presenter) {
      dispatch(startPresentationSuccess(presenter));
    }
    if (pdfFile)
      dispatch(setPdfFileB64(pdfFile, pageNumber || 0));
    if (snapShot)
      dispatch(setSnapShotLocal(snapShot));
    if (pageNumber)
      dispatch(setPageLocal(pageNumber));
  };
}

export function startPresentation() {
  return (dispatch, getState, {socketWrapper}) => {
    socketWrapper.reqPresenter();
  };
}

export function stopPresentation() {
  return (dispatch, getState, {socketWrapper}) => {
    socketWrapper.stopPresenter();
    dispatch(stopPresentationSuccess());
  };
}

export function startPresentationSuccess(presenter = null) {
  return {
    type: WhiteBoardAction.START_PRESENTATION_SUCCESS,
    presenter
  };
}

export function startPresentationReject() {
  return {
    type: WhiteBoardAction.START_PRESENTATION_REJECT
  };
}

export function stopPresentationSuccess() {
  return {
    type: WhiteBoardAction.STOP_PRESENTATION
  };
}

export function setSnapShot(snapShot) {
  return (dispatch, getState, {socketWrapper}) => {
    if (getState().whiteBoardInfo.presentationMode !== "RECV") {
      socketWrapper.syncSnapShot(snapShot);
    }

  };
}

export function setSnapShotLocal(snapShot) {
  return {
    snapShot,
    type: WhiteBoardAction.SET_SHAPES
  };
}

export function setPage(pageNumber) {
  return (dispatch, getState, {socketWrapper}) => {
    if (getState().whiteBoardInfo.presentationMode !== "RECV") {
      socketWrapper.syncPageNumber(pageNumber);
      dispatch(setPageLocal(pageNumber));
    }
  };
}

export function setPageLocal(pageNumber) {
  return {
    type: WhiteBoardAction.SET_PAGE,
    pageNumber
  };
}


export function resetNumPages(numPages) {
  return {
    type: WhiteBoardAction.RESET_NUMPAGES,
    numPages
  };
}

const _extractImagesFromPdf = function (pdfDataObject, dispatch, pageNumber = 0) {
  pdfjs.getDocument(pdfDataObject).then(function (pdf) {
    dispatch(resetNumPages(pdf.numPages));
    let imageDatas = [];
    for (let i = 1; i <= pdf.numPages; i++) {

      pdf.getPage(i).then(function (page) {
        let scale = 1;
        let viewport = page.getViewport(scale);

        let canvas = document.getElementById('the-canvas');
        let context = canvas.getContext('2d');
        // context.clearRect(0, 0, canvas.width, canvas.height);
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
          dispatch(setPageLocal(pageNumber));
        });

      });
    }

  }, function (e) {
    throw(e);
  });
};

export function setFile(file) {
  return (dispatch, getState) => {
    if (getState().whiteBoardInfo.presentationMode !== "ON") {
      return;
    }
    console.log("!!!");
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
  return (dispatch, getState, {socketWrapper}) => {
    let fileReader = new FileReader();
    fileReader.onload = function () {
      let result = fileReader.result;
      const b64String = _arrayBufferToBase64(result);
      socketWrapper.syncPdfFile(b64String);
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

export function setPdfFileB64(b64String, pageNumber) {
  return (dispatch) => {
    let pdfAsArray = convertDataURIToBinary(b64String);
    _extractImagesFromPdf(pdfAsArray, dispatch, pageNumber);
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
