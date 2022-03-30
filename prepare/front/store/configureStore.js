import { applyMiddleware, createStore, compose } from "redux";
import { createWrapper } from "next-redux-wrapper";
import reducer from "../reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../sagas/index";

// // redux-thunk 구소스 (cf. https://github.com/reduxjs/redux-thunk)
// const loggerMiddleware = ({dispatch, getState}) => (next) => (action) => {
//     console.log(action);
//     // // 지연 함수라 나중에 수행
//     // if(typeof action === 'function') {
//     //     return action(dispatch, getState);
//     // }
//     return next(action);
// }

const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware];
    // const middlewares = [sagaMiddleware, loggerMiddleware];
    const enhancer = process.env.NODE_ENV === 'production'
        ? compose(applyMiddleware(...middlewares))
        : composeWithDevTools(applyMiddleware(...middlewares)); // only develop mode - redux debugging 시 히스토리 추적을 위한 적용

    const store = createStore(reducer, enhancer);
    store.sagaTask = sagaMiddleware.run(rootSaga);

    // store.dispatch({
    //    type: 'CHANGE_NICKNAME',
    //    data: 'ttest',
    // });
    return store;
};


const wrapper = createWrapper(configureStore, {
    debug: process.env.NODE_ENV === 'development',
});

export default wrapper;


// 여러 컴포넌트들에서 공통적으로 쓰이는 데이터가 흩어져 있어야하고, 모으려면 부모로 모아서 자식으로 각각 보내줘야함
// 매번 수동으로 위의 작업을 하기엔 귀찮다
// 중앙 데이터 저장소 역할 = redux (react의 contextapi / mobx, graphQL의 아폴로)

// 비동기 3단계 : 요청 - 성공 / 실패
// contextapi에서는 직접 다 구현해야함, 보통 useEffect에서 api를 호출하고 컴포넌트에 들어감, 컴포넌트는 화면 그리기에만 집중하면 좋음
// 컴포넌트 밖으로 꺼낼 수 있으나, 구현하면 redux/mobx와 비슷한 코드가 됨
// 따라서 비동기 요청이 많아 지면 화면-데이터 처리를 분리하기 위해 redux/mobx 사용하면 깔끔
// 단, 중앙 데이터 저장소도 데이터가 커지면 쪼개기 필요
// 이때 redux사용하면 reducer로 쪼개기 가능

// ...state 를 하면 기존객체의 불변값은 참조를 유지하여 메모리에 이점
// ex. {
//  name: ''
//  posts: [{},{}, ... ,{}]
// }
// 아래를 수행하면 posts의 참조관계는 유지되고 name만 변경 (posts 새로 생성 안함)
// {...state,
//  name:'test'
// }

// redux가 개발모드일때는 action 히스토리를 가지고 있어 메모리 저장된 데이터가 계속 커짐
// 상용모드일때는 히스토리 필요없어서 메모리 정리를 계속 해줘 메모리 이슈가 없음

// redux의 기능을 middleware로 확장할 수 있다
// thunk 는 여러번 dispatch 하는 기능만 있음
// saga 는 delay, 로그인 클릭 두번을 하면 takeLatest로 가장 마지막 요청만 보내는 기능, 스크롤 할때 비동기 요청을 throw 하는 기능 throttle/debounce 등
