import { fork, put, throttle, all, delay, takeLatest, call } from "redux-saga/effects";
import axios from "axios";
import {
    ADD_COMMENT_FAILURE,
    ADD_COMMENT_REQUEST,
    ADD_COMMENT_SUCCESS,
    ADD_POST_FAILURE,
    ADD_POST_REQUEST,
    ADD_POST_SUCCESS,
    generateDummyPost,
    REMOVE_POST_FAILURE,
    REMOVE_POST_REQUEST,
    REMOVE_POST_SUCCESS,
    LOAD_POSTS_SUCCESS,
    LOAD_POSTS_FAILURE,
    LOAD_POSTS_REQUEST,
    UPLOAD_IMAGES_FAILURE,
    LIKE_POST_SUCCESS,
    LIKE_POST_FAILURE,
    UPLOAD_IMAGES_SUCCESS,
    RETWEET_FAILURE,
    RETWEET_SUCCESS,
    UNLIKE_POST_REQUEST,
    UPLOAD_IMAGES_REQUEST,
    LIKE_POST_REQUEST,
    RETWEET_REQUEST,
    UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE,
} from "../reducers/post";
import shortId from "shortid";
import {ADD_POST_TO_ME, REMOVE_POST_OF_ME} from "../reducers/user";


function addPostAPI(data) {
    console.log('------addPostAPI: ', data);
    return axios.post('/post', data);

    // 아래 코드는 saga/index 에 공통 설정으로 axios에 적용함
    // // 쿠키도 같이 전달하기 위해 true 전달 (포스트 등록시 401) - withCredentials
    // return axios.post('/post', { content : data}, { withCredentials: true});

}
function* addPost(action) {
    try {
        console.log('addPost-saga');
        // yield delay(1000);
        // const id = shortId.generate();

        const result = yield call(addPostAPI, action.data);
        yield put({
            type: ADD_POST_SUCCESS,
            data: result.data,
        });

        // user reducer 데이터 변경을 위한 액션
        yield put ({
            type: ADD_POST_TO_ME,
            data: result.data.id,
        })
    } catch (err) {
        yield put({
            type: ADD_POST_FAILURE,
            data: err.response.data,
        })
    }
}


function loadPostsAPI(lastId) {
    return axios.get(`/posts?lastId=${lastId || 0}`);
}

function* loadPosts(action) {
    try {
        const result = yield call(loadPostsAPI, action.lastId);
        yield put({
            type: LOAD_POSTS_SUCCESS,
            data: result.data,
            // data: generateDummyPost(10),
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: LOAD_POSTS_FAILURE,
            error: err.response.data,
        });
    }
}



function removePostAPI(data) {
    return axios.delete(`/post/${data}`);
}

function* removePost(action) {
    try {
        const result = yield call(removePostAPI, action.data);
        // yield delay(1000);

        // console.log('removePost--', action);
        // const result = yield fork(removePostAPI, action.data)
        yield put ({
            type: REMOVE_POST_SUCCESS,
            data: result.data,
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
    return axios.post(`/post/${data.postId}/comment`, data); // POST /post/1/comment
}

function* addComment(action) {
    try {
        console.log('addComment-saga');
        // yield delay(1000);
        const result = yield call(addCommentAPI, action.data);

        console.log('addComment-saga', result);
        yield put ({
            type: ADD_COMMENT_SUCCESS,
            data: result.data,
        })
    } catch (err) {
        console.error(err);
        yield put ({
            type: ADD_COMMENT_FAILURE,
            data: err.response.data,
        })
    }
}

function retweetAPI(data) {
    return axios.post(`/post/${data}/retweet`);
}

function* retweet(action) {
    try {
        console.log('retweet----action-', action)

        const result = yield call(retweetAPI, action.data);
        console.log('retweet----result-', result)

        yield put({
            type: RETWEET_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: RETWEET_FAILURE,
            error: err.response.data,
        });
    }
}

function uploadImagesAPI(data) {
    return axios.post('/post/images', data); // form data는 그대로 전달 {data:data} 하면 json이 되어 넘어감
}

function* uploadImages(action) {
    try {
        const result = yield call(uploadImagesAPI, action.data);
        yield put({
            type: UPLOAD_IMAGES_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: UPLOAD_IMAGES_FAILURE,
            error: err.response.data,
        });
    }
}

function likePostAPI(data) {
    return axios.patch(`/post/${data}/like`); // 게시글의 일부분 수정이라 patch
}

function* likePost(action) {
    try {
        const result = yield call(likePostAPI, action.data);
        yield put({
            type: LIKE_POST_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: LIKE_POST_FAILURE,
            error: err.response.data,
        });
    }
}

function unlikePostAPI(data) {
    return axios.delete(`/post/${data}/like`);
}

function* unlikePost(action) {
    try {
        const result = yield call(unlikePostAPI, action.data);
        yield put({
            type: UNLIKE_POST_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: UNLIKE_POST_FAILURE,
            error: err.response.data,
        });
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
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
    // yield throttle(10 * 1000, ADD_COMMENT_REQUEST, addComment); // 10 sec
}

function* watchRetweet() {
    yield takeLatest(RETWEET_REQUEST, retweet);
}

function* watchUploadImages() {
    yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchLikePost() {
    yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchUnlikePost() {
    yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

export default function* userSaga() {
    yield all ([
        fork(watchAddPost),
        fork(watchLoadPost),
        fork(watchRemovePost),
        fork(watchAddComment),
        fork(watchRetweet),
        fork(watchUploadImages),
        fork(watchLikePost),
        fork(watchUnlikePost),
    ])
}
