import axios from 'axios';
import EventBus from 'eventing-bus';
import { all, takeEvery, call, put } from 'redux-saga/effects';

import { setAllSchemas, setSingleSchemas, toggleCreateSchema } from '../actions/Auth';

/*========== SCHEMA FUNCTIONS =============*/
function* getAllSchemas() {
  const { error, response } = yield call(getCall, '/schemas');
  if (error) EventBus.publish("error", error['response']['results']['message']);
  else if (response) yield put(setAllSchemas(response['data']['results']));
};

function* getSingleSchemas({ payload }) {
  const { error, response } = yield call(getCall, `/schemas/${payload}`);
  if (error) EventBus.publish("error", error['response']['results']['message']);
  else if (response) yield put(setSingleSchemas(response['data']));
};

function* createSchema({ payload }) {
  const { error, response } = yield call(postCall, { path: `/schemas`, payload });
  if (error) EventBus.publish("error", error['response']['results']['message']);
  else if (response)
    yield put(toggleCreateSchema(false));
    yield put({ type: "GET_ALL_SCHEMA_DATA" });
};


/*========== OBJECTS FUNCTIONS =============*/
function* getSchemaObjects({ payload }) {
  const { error, response } = yield call(getCall, `/objects/${payload}`);
  if (error) EventBus.publish("error", error['response']['results']['message']);
  else if (response)
    // yield put(setAllSchemas(response['data']['results']));
    console.log('*****All Schema Objects', response['data']['results']);
};

function* createSchemaObject({ objectId, payload }) {
  const { error, response } = yield call(postCall, { path: `/objects/${objectId}`, payload });
  if (error) EventBus.publish("error", error['response']['results']['message']);
  else if (response)
    // yield put(setAllSchemas(response['data']['results']));
    console.log('*****All Schema Objects', response['data']['results']);
};

function* actionWatcher() {
  yield takeEvery('GET_ALL_SCHEMA_DATA', getAllSchemas);
  yield takeEvery('GET_SINGLE_SCHEMA_DATA', getSingleSchemas);
  yield takeEvery('CREATE_SCHEMA', createSchema);

  yield takeEvery('GET_SCHEMA_OBJECTS', getSchemaObjects);
  yield takeEvery('CREATE_SCHEMA_OBJECT', createSchemaObject);

};

export default function* rootSaga() {
  yield all([actionWatcher()]);
};

function postCall({ path, payload }) {
  return axios
    .post(path, payload)
    .then(response => ({ response }))
    .catch(error => {
      return { error };
    });
};

function getCall(path) {
  return axios
    .get(path)
    .then(response => ({ response }))
    .catch(error => {
      return { error };
    });
};

function deleteCall(path) {
  return axios
    .delete(path)
    .then(response => ({ response }))
    .catch(error => {
      return { error };
    });
};

function putCall({ path, payload }) {
  return axios
    .put(path, payload)
    .then(response => ({ response }))
    .catch(error => {
      return { error };
    });
};
