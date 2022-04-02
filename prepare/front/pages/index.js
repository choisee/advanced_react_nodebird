import React, { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { useDispatch, useSelector } from "react-redux";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import axios from "axios";
import { END } from "redux-saga";

const Home = () => {
	const dispatch = useDispatch();
	const { hasMorePosts, loadPostsLoading, mainPosts, retweetError } = useSelector(
		(state) => state.post,
	);
	const { me } = useSelector((state) => state.user);

	useEffect(() => {
		if (retweetError) {
			alert(retweetError);
		}
	}, [retweetError]);

	useEffect(() => {
		dispatch({
			type: LOAD_USER_REQUEST,
		});
		dispatch({
			type: LOAD_POSTS_REQUEST,
		});
	}, []);

	useEffect(() => {
		function onScroll() {
			// 얼마나 내렸는지, 화면 보이는 길이, 총 길이
			// console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);

			// 가장 아래 -300 스크롤 되었을 떄 미리 로딩
			// if(window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
			if (
				window.scrollY + document.documentElement.clientHeight >
				document.documentElement.scrollHeight - 300
			) {
				if (hasMorePosts && !loadPostsLoading) {
					// loadPostsLoading로 이미 요청이 있다면 끝나고 요청수행
					const lastId = mainPosts[mainPosts.length - 1]?.id;
					dispatch({
						type: LOAD_POSTS_REQUEST,
						lastId,
					});
				}
			}
		}

		window.addEventListener("scroll", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
		};
	}, [hasMorePosts, loadPostsLoading, mainPosts]);

	return (
		<AppLayout>
			{me && <PostForm />}
			{mainPosts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</AppLayout>
	);
};

// Home.getIntialProps

// front server의 실행범위
// 화면을 그리기 전에 서버요청을 함
// SSR 될떄 처리
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
	console.log("getServerSideProps start");
	// console.log(context.req.headers);
	const cookie = context.req ? context.req.headers.cookie : ""; // 서버로 쿠키 전달
	axios.defaults.headers.Cookie = ""; // 대문자 주의 Cookie // connect.sid로 로그인 확인 // 쿠키 공유 이슈 막기 위해 '' 초기화 우선함
	if (context.req && cookie) {
		// 서버 사이드 렌더링 구현할때 주의
		// 다른사람의 쿠키가 공유되는 문제가 발생할 수 있음
		// 그래서 이 조건문 안에서만 쿠키 넣어주어야함
		axios.defaults.headers.Cookie = cookie;
	}

	// req, req만 날림
	context.store.dispatch({
		type: LOAD_MY_INFO_REQUEST,
	});
	context.store.dispatch({
		type: LOAD_POSTS_REQUEST,
	});
	context.store.dispatch(END);
	console.log("getServerSideProps end");
	// req, req 후 > success, success까지 확인 후 리턴
	await context.store.sagaTask.toPromise();
});

export default Home;

// nextjs 에서는 import React ~~ 를 할 필요가 없음
// nextjs는 무조건 pages 여야함, pages 하위를 모두 페이지로 만들어 줌, pages 폴더명은 꼭 지킬 것

// 각 페이지별로 레이아웃을 다르게 적용할 수 있음
// <AppLayout> <div>Hello, Next!</div> </AppLayout> 처럼 페이지를 만든 레이아웃으로 감싸면 됨
