/*========== PAGE LOADER ACTIONS ============= */
export const setLoader = (data) => ({
  type: 'SET_LOADER',
  payload: data,
});

/*========== SCHEMA ACTIONS ============= */
export const getAllSchemas = () => ({
  type: 'GET_ALL_SCHEMA_DATA',
});

export const setAllSchemas = (data) => ({
  type: 'SET_ALL_SCHEMA_DATA',
  payload: data,
});

export const getSingleSchemas = (data) => ({
  type: 'GET_SINGLE_SCHEMA_DATA',
  payload: data,
});

export const setSingleSchemas = (data) => ({
  type: 'SET_SINGLE_SCHEMA_DATA',
  payload: data,
});

export const createSchema = (data) => ({
  type: 'CREATE_SCHEMA',
  payload: data,
});

export const toggleCreateSchema = (data) => ({
  type: 'TOGGLE_CREATE_SCHEMA',
  payload: data,
});

/*========== OBJECTS ACTIONS ============= */
export const getSchemaObjects = (data) => ({
  type: 'GET_SCHEMA_OBJECTS',
  payload: data,
});

export const setSchemaObjects = (data) => ({
  type: 'SET_SCHEMA_OBJECTS',
  payload: data,
});

export const addNewObject = (data, objectId) => ({
  type: 'ADD_NEW_OBJECTS',
  objectId,
  payload: data,
});

export const editObject = (data, objectId) => ({
  type: 'EDIT_OBJECT',
  objectId,
  payload: data,
});