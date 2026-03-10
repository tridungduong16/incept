import { type SagaIterator } from 'redux-saga'
import { all, fork } from 'redux-saga/effects'

// Add app-related sagas here

function* watchAppSagas(): SagaIterator {
  // yield takeLatest(someAction.type, someHandler)
}

export default function* appSaga(): SagaIterator {
  yield all([fork(watchAppSagas)])
}
