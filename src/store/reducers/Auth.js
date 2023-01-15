import { PURGE } from "redux-persist";
import { setToken } from '../axios';

var initialState = {
  isLoader: { message: 'Please Wait...', status: false },

  rewardsData: [],
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
        rewardsData: payload
      }

    case 'TOGGLE_CREATE_MODAL':
      return {
        ...state,
        isRewardModal: payload
      }

    default:
      return state;
  }
};

export default Auth;