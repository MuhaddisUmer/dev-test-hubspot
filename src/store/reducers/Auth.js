import { PURGE } from "redux-persist";
import { setToken } from '../axios';

var initialState = {
  isLoader: { message: 'Please Wait...', status: false },

  listData: [],
  objectData: {},
  isRewardModal: false,
};

const Auth = (state = initialState, { type, payload }) => {
  switch (type) {
    case PURGE: return initialState;

    /*========== LOADER REDUCERS ============= */

    case 'SET_LOADER':
      return {
        ...state,
        isLoader: payload
      };

    /*========== REWARDS REDUCERS ============= */

    case 'SET_LIST_DATA':
      return {
        ...state,
        listData: payload
      };

    case 'SET_OBJECT_DATA':
      return {
        ...state,
        objectData: payload
      };

    case 'TOGGLE_CREATE_MODAL':
      return {
        ...state,
        isRewardModal: payload
      };

    default:
      return state;
  }
};

export default Auth;