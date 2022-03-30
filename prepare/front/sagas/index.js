import { all, fork, call, put, take, delay, debounce, throttle, takeLatest, takeMaybe, takeEvery } from "redux-saga/effects";
import axios from 'axios';
import postSaga from './post';
import userSaga from './user';

axios.defaults.baseURL = "http://localhost:3065";

export default function* rootSaga() {
    console.log('rootSaga')
    yield all([fork(postSaga), fork(userSaga)]);
}

// saga 분리함
// // -----------------------------------------------------------
//
// function logInAPI(data) {
// // function logInAPI(data, 'a', 'b', 'c') {
//     return axios.post('/api/login')
// }
// function logOutAPI() {
//     return axios.post('/api/logout')
// }
// function addPostAPI() {
//     return axios.post('/api/post')
// }
//
//
// // -----------------------------------------------------------
//
// // 성공 결과 result.data
// // 실패 결과 err.response.data
// function* logIn(action) {
//     try {
//
//         yield delay(1000); // 서버 구현 전 목업 데이터 사용할떄 딜레이 활용
//         // 서버 구현 후 열기
//         // // const result = yield fork(logInAPI)
//         // const result = yield call(logInAPI, action.data); // 1번 실행 항목
//
//         // action 객체
//         yield put ({                                // 2번 실행 항목
//             type: 'LOG_IN_SUCCESS',
//             data: result.data
//         })
//     } catch (err) {
//         yield put ({
//             type: 'LOG_IN_FAILURE',
//             data: err.response.data,
//         })
//     }
// }
//
// function* logOut() {
//     try {
//         const result = yield fork(logOutAPI)
//         yield put ({
//             type: 'LOG_OUT_SUCCESS',
//             data: result.data
//         })
//     } catch (err) {
//         yield put ({
//             type: 'LOG_OUT_FAILURE',
//             data: err.response.data,
//         })
//     }
// }
//
// function* addPost(action) {
//     try {
//         const result = yield fork(addPostAPI, action.data)
//         yield put ({
//             type: 'ADD_POST_SUCCESS',
//             data: result.data
//         })
//     } catch (err) {
//         yield put ({
//             type: 'ADD_POST_FAILURE',
//             data: err.response.data,
//         })
//     }
// }
//
// // -----------------------------------------------------------
// // 테스트
// const l = logIn({type:'LOG_IN_REQUEST', data: {id:'boogi@gmail.com'}})
// l.next(); // 1번 실행 항목 - 실행됨
// l.next(); // 2번 실행 항목 - 실행됨
//
//
// // -----------------------------------------------------------
// // yield take 일회용 - 로그인 한번 하면 사라짐
// // 이를 해결하기 위해 while을 사용함 - while(true) 구문 대신 takeEvery 사용
// // takeLeading 맨 처음 요청만 수행하고 싶을 경우 사용
// // 실수로 마우스는 두번 누르는 경우 api 요청 중복을 막기 위해 takeLatest 사용
// // 로딩 중인 요청이 두개 이상일 경우에 선행 요청한 !응답!을 취소시킴
// // 그래서 백엔드에서는 중복 데이터를 저장 하지 않도록 별도 검증처리 해줘야 함 (오우...치명적 단점...)
// // 이미 완료된 요청은 취소시키지 않음
//
// function* watchLogIn() {
//     yield takeLatest("LOG_IN_REQUEST", logIn);
//
//     // yield takeEvery("LOG_IN_REQUEST", logIn);
//
//     // while(true){
//     //     yield take("LOG_IN_REQUEST", logIn);
//     // }
// }
//
// function* watchLogOut() {
// 	yield takeLatest("LOG_OUT_REQUEST", logOut);
// }
//
// function* watchAddPost() {
//     // 요청을 10초안에 한번만 받도록 처리하기 위해 throttle 사용 가능함
//     yield throttle("ADD_POST_REQUEST", addPost, 10 * 1000);
// }
//
// export default function* rootSaga() {
// 	yield all([fork(watchLogIn), fork(watchLogOut), fork(watchAddPost)]);
// }


// saga generator

// generator 란, 제너레이터를 사용하면 yield를 사용하여 함수를 수행하다 멈출 수 있음
// const gen = function* () {
//     console.log(1);
//     yield;
//     console.log(2);
//     yield;
//     console.log(3);
//     yield 4;
// }

// const genExecute = gen();
// // 결과
// genExecute.next()
// {value: undefined, done: false}
// genExecute.next()
// {value: undefined, done: false}
// genExecute.next()
// {value: 4, done: false}
// genExecute.next()
// {value: undefined, done: true}

// while 도 수행 중 멈춤
// let i = 0;
// const gen = function* (){
//     while(true){
//         yield i++;
//     }
// }
// const g = gen();
// g.next();
// // // 결과
// // g.next()
// // {value: 0, done: false}
// // g.next()
// // {value: 1, done: false}
// // g.next()
// // {value: 2, done: false}

// 위 성질을 활용하여 generator로 이벤트 리스너를 만들 수 있음

// all 묶어서 동시에 실행하게 해줌
// fork 함수 실행
// fork vs call = 비동기 함수 호출 vs 동기 함수 호출

// throttle vs debounce (cf. https://www.zerocho.com/category/JavaScript/post/59a8e9cb15ac0000182794fa)

