// src/redux/reducers.js
import {LOGOUT, SET_EMAIL} from './action';

const initialState = {
  email: '',
};

const emailReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EMAIL:
      return {
        ...state,
        email: action.payload,
      };
      case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default emailReducer;
