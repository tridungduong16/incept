import { type SagaIterator } from 'redux-saga'
import { all, fork } from 'redux-saga/effects'
import appSaga from './features/app/appSaga'

export default function* rootSaga(): SagaIterator {
  yield all([fork(appSaga)])
}
