import {WhiteBoardAction} from '../constants/actionTypes';
export default function (state = {images: [], pageNumber: -1, numPages: 0, snapShot: "", presenter: null, presentationMode:"OFF"}, action) {
  switch (action.type) {
    case WhiteBoardAction.PDF_START:
      return state;
    case WhiteBoardAction.SET_IMAGES:
      return {...state, images: [...action.images], pageNumber: 0};
    case WhiteBoardAction.RESET_NUMPAGES:
      return {...state, numPages: action.numPages};
    case WhiteBoardAction.SET_PAGE:
      return {...state, pageNumber: action.pageNumber};
    case WhiteBoardAction.SET_SHAPES:
      return {...state, snapShot: action.snapShot};
    case WhiteBoardAction.START_PRESENTATION_SUCCESS:
      return {...state, presenter: action.presenter, presentationMode: action.presenter ? "RECV" : "ON"};
    case WhiteBoardAction.START_PRESENTATION_REJECT:
      return state;
    case WhiteBoardAction.STOP_PRESENTATION:
      return {...state, presenter: null, presentationMode: "OFF"};
    default:
      return state;
  }
}
