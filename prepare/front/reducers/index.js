const initialState = {
    user: {
        isLoggedIn: false,
        user: null,
        signUpData: {},
        loginData: {}
    },
    post: {
        mainPosts: [],
    },
}

export const loginAction = (data) => {
    return {
        type: 'LOG_IN',
        data,
    }
}

export const logoutAction = () => {
    return {
        type: 'LOG_OUT',
    }
}

// 이전상태와 액션을 통해서 다음 상태를 만들어 내는 함수, (이전상태, 액션) => 다음상태
const rootReducer = (state = initialState, action) => {
    switch (action.type){
        case 'LOG_IN':
            return {
                ...state,
                user: {
                    ...state.user,
                    isLoggedIn: true,
                    user: action.data
                }
            }
        case 'LOG_OUT':
            return {
                ...state,
                user: {
                    ...state.user,
                    isLoggedIn: false,
                    user: null
                }
            }
        default:
            return state;
    }
};

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