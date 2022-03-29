import { fork, put, throttle, all, delay, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
	ADD_COMMENT_FAILURE,
	ADD_COMMENT_REQUEST,
	ADD_COMMENT_SUCCESS,
	ADD_POST_FAILURE,
	ADD_POST_REQUEST,
	ADD_POST_SUCCESS,
	ADD_POST_TO_ME,
	generateDummyPost,
	REMOVE_POST_FAILURE,
	REMOVE_POST_OF_ME,
	REMOVE_POST_REQUEST,
	REMOVE_POST_SUCCESS,
	LOAD_POSTS_SUCCESS,
	LOAD_POSTS_FAILURE,
	LOAD_POSTS_REQUEST,
} from "../reducers/post";
import shortId from "shortid";


function addPostAPI() {
    return axios.post('/api/post')
}
function* addPost(action) {
    try {
        console.log('addPost-saga');
        yield delay(1000);
        const id = shortId.generate();

        // const result = yield fork(addPostAPI, action.data)
        yield put ({
            type: ADD_POST_SUCCESS,
            data: {
                id: id,
                content: action.data
            },
        })

        // user reducer 데이터 변경을 위한 액션
        yield put ({
            type: ADD_POST_TO_ME,
            data: id,
        })
    } catch (err) {
        yield put({
            type: ADD_POST_FAILURE,
            data: err.response.data,
        })
    }
}


function loadPostsAPI(data) {
    return axios.post('/api/posts', data)
}
function* loadPosts(action) {
    try {
        yield delay(1000);

        yield put ({
            type: LOAD_POSTS_SUCCESS,
            data: generateDummyPost(10),
        })

    } catch (err) {
        yield put({
            type: LOAD_POSTS_FAILURE,
            data: err.response.data,
        })
    }
}


function removePostAPI(data) {
    return axios.delete('/api/post', data)
}

function* removePost(action) {
    try {
        yield delay(1000);

        console.log('removePost--', action);
        // const result = yield fork(removePostAPI, action.data)
        yield put ({
            type: REMOVE_POST_SUCCESS,
            data: action.data,
        })

        yield put ({
            type: REMOVE_POST_OF_ME,
            data: action.data,
        })
    } catch (err) {
        yield put({
            type: REMOVE_POST_FAILURE,
            data: err.response.data,
        })
    }
}


function addCommentAPI(data) {
    return axios.post(`/api/post/${data.postId}/comment`, data);
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
    yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchLoadPost() {
    // throttle 사용으로 응답은 막힘 , 요청 막기는 별도 처리함
    yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchRemovePost() {
    yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
    yield throttle(10 * 1000, ADD_COMMENT_REQUEST, addComment); // 10 sec
}



export default function* userSaga() {
    yield all ([
        fork(watchAddPost),
        fork(watchLoadPost),
        fork(watchRemovePost),
        fork(watchAddComment),
    ])
}
