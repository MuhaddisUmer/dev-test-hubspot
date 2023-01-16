import { PURGE } from "redux-persist";
import { setToken } from '../axios';

var initialState = {
  isLoader: { message: 'Please Wait...', status: false },

  allSchemas: [],
  isRewardModal: false,

  allObjects: [],
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

    /*========== SCHEMA REDUCERS ============= */

    case 'SET_ALL_SCHEMA_DATA':
      return {
        ...state,
        allSchemas: payload
      }

    case 'TOGGLE_CREATE_MODAL':
      return {
        ...state,
        isRewardModal: payload
      };

    /*========== SCHEMA REDUCERS ============= */
    case 'SET_SCHEMA_OBJECTS':
      return {
        ...state,
        allObjects: payload
      }

    default:
      return state;
  }
};

export default Auth;