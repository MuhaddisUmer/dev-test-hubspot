/*========== PAGE LOADER ACTIONS ============= */

export const setLoader = (data) => ({
  type: 'SET_LOADER',
  payload: data,
});

/*========== DATA ACTIONS ============= */

export const getAllSchemas = () => ({
  type: 'GET_LIST_DATA',
});


export const setAllSchemas = (data) => ({
  type: 'SET_LIST_DATA',
  payload: data,
});

export const toggleCreateModal = (data) => ({
  type: 'TOGGLE_CREATE_MODAL',
  payload: data,
});

export const sendRewards = (data) => ({
  type: 'SEND_REWARDS',
  payload: data,
});



