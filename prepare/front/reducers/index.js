import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";
import user from "./user";
import post from "./post";


// 이전상태와 액션을 통해서 다음 상태를 만들어 내는 함수, (이전상태, 액션) => 다음상태
const rootReducer = combineReducers({
	index: (state = {}, action) => {
		switch (action.type) {
			case HYDRATE: // 서버사이드 렝더링용
				console.log("HYDRATE", action);
				return action.payload;
			default:
				return state; // reducer 초기화할때 default 실행되며 initialStated 실행됨
		}
	},
	user,
	post,
});

export default rootReducer;

// // 액션
// // 비동기 액션 생성기 async action creator(redux-saga)
// // 동적 액션 생성기 dynamic action creator
// const changeNickname = (data) => {
//     return {
//         type: 'CHANGE_NICKNAME',
//         data,
//     }
// }
// // ex. store.dispatch(changeNickname('다라'))
// // // 아래와 같이 미리 정의 하기 보단 위와 같이 action creator를 만들자
// // const changeNickname = {
// //     type: 'CHANGE_NICKNAME',
// //     data: 'aaa'
// // }
// // const changeNickname = {
// //     type: 'CHANGE_NICKNAME',
// //     data: '가나'
// // }