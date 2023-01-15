import axios from 'axios';
import jwt_decode from 'jwt-decode';
import EventBus from 'eventing-bus';
import { all, takeEvery, call, put } from 'redux-saga/effects';

import { setListData, toggleCreateModal } from '../actions/Auth';

/*========== REWARDS FUNCTIONS =============*/

function* getListData() {
  const { error, response } = yield call(getCall, '/schemas');
  if (error) EventBus.publish("error", error['response']['results']['message']);
  else if (response) yield put(setListData(response['data']['results']));
};

function* sendRewards({ payload }) {
  const { error, response } = yield call(postCall, { path: '/leaderboard/rewardsSent', payload });
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) {
    yield put({ type: "GET_LIST_DATA" });
    EventBus.publish("success", response['data']['body']['message']);
  }
  yield put(toggleCreateModal(false));
};

function* actionWatcher() {
  yield takeEvery('GET_LIST_DATA', getListData);
  yield takeEvery('SEND_REWARDS', sendRewards);
};

export default function* rootSaga() {
  yield all([actionWatcher()]);
};

function postCall({ path, payload }) {
  return axios
    .post(path, payload)
    .then(response => ({ response }))
    .catch(error => {
      if (error.response.status === 401) EventBus.publish("tokenExpired");
      return { error };
    });
};

function getCall(path) {
  return axios
    .get(path)
    .then(response => ({ response }))
    .catch(error => {
      if (error.response.status === 401) EventBus.publish("tokenExpired");
      return { error };
    });
};

function deleteCall(path) {
  return axios
    .delete(path)
    .then(response => ({ response }))
    .catch(error => {
      if (error.response.status === 401) EventBus.publish("tokenExpired");
      return { error };
    });
};

function putCall({ path, payload }) {
  return axios
    .put(path, payload)
    .then(response => ({ response }))
    .catch(error => {
      if (error.response.status === 401) EventBus.publish("tokenExpired");
      return { error };
    });
};
