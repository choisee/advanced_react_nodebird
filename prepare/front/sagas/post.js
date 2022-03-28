import {fork, put, throttle, all, delay, takeLatest} from "redux-saga/effects";
import axios from "axios";
import {
    ADD_COMMENT_FAILURE,
    ADD_COMMENT_REQUEST,
    ADD_COMMENT_SUCCESS, ADD_POST_FAILURE,
    ADD_POST_REQUEST,
    ADD_POST_SUCCESS
} from "../reducers/post";
import {LOG_IN_REQUEST} from "../reducers/user";


function addPostAPI() {
    return axios.post('/api/post')
}

function addCommentAPI(data) {
    return axios.post(`/api/post/${data.postId}/comment`, data);
}

function* addPost(action) {
    try {
        console.log('addPost-saga');
        yield delay(1000);

        // const result = yield fork(addPostAPI, action.data)
        yield put ({
            type: ADD_POST_SUCCESS,
            data: action.data,
        })
    } catch (err) {
        yield put({
            type: ADD_POST_FAILURE,
            data: err.response.data,
        })
    }
}

function* addComment(action) {
    try {
        console.log('addComment-saga');
        yield delay(1000);

        // const result = yield fork(addPostAPI, action.data)
        yield put ({
            type: ADD_COMMENT_SUCCESS,
            data: action.data,
        })
    } catch (err) {
        yield put ({
            type: ADD_COMMENT_FAILURE,
            data: err.response.data,
        })
    }
}


function* watchAddPost() {
    yield throttle(10 * 1000, ADD_POST_REQUEST, addPost); // 10 sec
}

function* watchAddComment() {
    yield throttle(10 * 1000, ADD_COMMENT_REQUEST, addComment); // 10 sec
}



export default function* userSaga() {
    yield all ([
        fork(watchAddPost),
        fork(watchAddComment),
    ])
}
