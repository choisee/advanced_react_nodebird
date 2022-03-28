import {delay, fork, put, takeLatest, all, call} from "redux-saga/effects";
import axios from "axios";
import {
    LOG_IN_FAILURE,
    LOG_IN_REQUEST,
    LOG_IN_SUCCESS,
    LOG_OUT_FAILURE,
    LOG_OUT_REQUEST,
    LOG_OUT_SUCCESS, SIGN_UP_FAILURE, SIGN_UP_REQUEST, SIGN_UP_SUCCESS
} from "../reducers/user";


function logInAPI(data) {
    return axios.post('/api/login')
}
function logOutAPI() {
    return axios.post('/api/logout')
}
function signUpAPI(data) {
    return axios.post('/api/signUp')
}

function* logIn(action) {
    try {
        console.log('saga-logIn', action.data)

        yield delay(1000);

        yield put ({
            type: LOG_IN_SUCCESS,
            data: action.data
        })
    } catch (err) {
        yield put ({
            type: LOG_IN_FAILURE,
            error: err.response.data,
        })
    }
}

function* logOut() {
    try {
        const result = yield fork(logOutAPI)
        yield put ({
            type: LOG_OUT_SUCCESS,
            data: result.data
        })
    } catch (err) {
        yield put ({
            type: LOG_OUT_FAILURE,
            error: err.response.data,
        })
    }
}

function* signUp() {
    try {
        console.log('saga-logIn')

        yield delay(1000);
        throw new Error();

        const result = yield fork(logOutAPI)
        yield put ({
            type: SIGN_UP_SUCCESS,
            data: result.data
        })
    } catch (err) {
        yield put ({
            type: SIGN_UP_FAILURE,
            error: err.response.data,
        })
    }
}




function* watchLogIn() {
    console.log('watchLogIn')
    yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
    yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
    yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
    yield all ([
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchSignUp),
    ])
}