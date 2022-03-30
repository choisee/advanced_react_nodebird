import shortId from "shortid";
import produce from "immer";
import faker from "faker";

export const initialState = {
    mainPosts: [],
    imagePaths: [],
	hasMorePosts: true,
	loadPostsLoading: false,
	loadPostsDone: false,
	loadPostsError: null,
    addPostLoading: false,
    addPostDone: false,
    addPostError: null,
	likePostLoading: false,
	likePostDone: false,
	likePostError: null,
	unlikePostLoading: false,
	unlikePostDone: false,
	unlikePostError: null,
    removePostLoading: false,
    removePostDone: false,
    removePostError: null,
    addCommentLoading: false,
    addCommentDone: false,
    addCommentError: null,
	uploadImagesLoading: false,
	uploadImagesDone: false,
	uploadImagesError: null,
	retweetLoading: false,
	retweetDone: false,
	retweetError: null,
}

// {
//         id: 1,
//         User: {
//             id: 1,
//             nickname: 'choisee',
//         },
//         content: '첫번째 게시글 #해시태그',
//         Images: [{
// 			id: shortId.generate(),
//             src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
//         }, {
// 			id: shortId.generate(),
//             src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
//         }, {
// 			id: shortId.generate(),
//             src: 'https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg',
//         }],
//         Comments: [{
// 			id: shortId.generate(),
//             User : {
// 				id: shortId.generate(),
//                 nickname: 'sugar'
//             },
//             content: '오 롸이언',
//         },{
// 			id: shortId.generate(),
//             User : {
// 				id: shortId.generate(),
//                 nickname: 'salt'
//             },
//             content: '오 춘식쓰',
//         }]
//     }

export const generateDummyPost = (number) => Array(number).fill().map(() => ({
	id: shortId.generate(),
	User: {
		id: shortId.generate(),
		nickname: faker.name.findName()
	},
	content: faker.lorem.paragraph(),
	Images: [{
		src: faker.image.image(),
	}],
	Comments: [{
		User: {
			id: shortId.generate(),
			nickname: faker.name.findName(),
		},
		content: faker.lorem.sentence(),
	}],
}))

// initialState.mainPosts = initialState.mainPosts.concat(generateDummyPost(20));

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';


export const addPost = (data) => ({
    type: ADD_POST_REQUEST,
    data,
});

export const addComment = (data) => ({
    type: ADD_COMMENT_REQUEST,
    data,
});

const dummyPost = (data) => ({
	id: data.id, // make id in random
	content: data.content,
	User: {
		id: 1,
		nickname: 'choisee2',
	},
	Images: [],
	Comments: [],
});

const dummyComment = (data) => ({
	id: shortId.generate(),
	content: data,
	User: {
		id: 1,
		nickname: 'choisee33',
	},
});

const reducer = (state = initialState, action) => produce(state, (draft) => {
	switch (action.type) {
		case RETWEET_REQUEST:
			draft.retweetLoading = true;
			draft.retweetDone = false;
			draft.retweetError = null;
			break;
		case RETWEET_SUCCESS: {
			draft.retweetLoading = false;
			draft.retweetDone = true;
			draft.mainPosts.unshift(action.data);
			break;
		}
		case RETWEET_FAILURE:
			draft.retweetLoading = false;
			draft.retweetError = action.error;
			break;
		case REMOVE_IMAGE:
			draft.imagePaths = draft.imagePaths.filter((v, i) => i !== action.data);
			break;
		case UPLOAD_IMAGES_REQUEST:
			draft.uploadImagesLoading = true;
			draft.uploadImagesDone = false;
			draft.uploadImagesError = null;
			break;
		case UPLOAD_IMAGES_SUCCESS: {
			draft.imagePaths = action.data;
			draft.uploadImagesLoading = false;
			draft.uploadImagesDone = true;
			break;
		}
		case UPLOAD_IMAGES_FAILURE:
			draft.uploadImagesLoading = false;
			draft.uploadImagesError = action.error;
			break;
		case LIKE_POST_REQUEST:
			draft.likePostLoading = true;
			draft.likePostDone = false;
			draft.likePostError = null;
			break;
		case LIKE_POST_SUCCESS: {
			const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
			post.Likers.push({ id: action.data.UserId });
			draft.likePostLoading = false;
			draft.likePostDone = true;
			break;
		}
		case LIKE_POST_FAILURE:
			draft.likePostLoading = false;
			draft.likePostError = action.error;
			break;
		case UNLIKE_POST_REQUEST:
			draft.unlikePostLoading = true;
			draft.unlikePostDone = false;
			draft.unlikePostError = null;
			break;
		case UNLIKE_POST_SUCCESS: {
			const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
			post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);
			draft.unlikePostLoading = false;
			draft.unlikePostDone = true;
			break;
		}
		case UNLIKE_POST_FAILURE:
			draft.unlikePostLoading = false;
			draft.unlikePostError = action.error;
			break;
		case LOAD_POSTS_REQUEST:
			draft.loadPostsLoading = true;
			draft.loadPostsDone = false;
			draft.loadPostsError = null;
			break;
		case LOAD_POSTS_SUCCESS:
			draft.loadPostsLoading = false;
			draft.loadPostsDone = true;
			// draft.mainPosts = action.data.concat(draft.mainPosts); // 기존데이터 + 더미데이터
			// draft.hasMorePosts = draft.mainPosts.length < 50; // 게시들 50개만 로드
			draft.mainPosts = draft.mainPosts.concat(action.data);
			draft.hasMorePosts = action.data.length === 10;
			break;
		case LOAD_POSTS_FAILURE:
			draft.loadPostsLoading = false;
			draft.loadPostsError = action.error;
			break;
		case ADD_POST_REQUEST:
			draft.addPostLoading = true;
			draft.addPostDone = false;
			draft.addPostError = null;
			break;
		case ADD_POST_SUCCESS:
			draft.addPostLoading = false;
			draft.addPostDone = true;
			// draft.mainPosts.unshift(dummyPost(action.data));
			draft.mainPosts.unshift(action.data);
			draft.imagePaths = [];
			break;
		case ADD_POST_FAILURE:
			draft.addPostLoading = false;
			draft.addPostError = action.error;
			break;
		case REMOVE_POST_REQUEST:
			draft.removePostLoading = true;
			draft.removePostDone = false;
			draft.removePostError = null;
			break;
		case REMOVE_POST_SUCCESS:
			draft.removePostLoading = false;
			draft.removePostDone = true;
			draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data.PostId);
			break;
		case REMOVE_POST_FAILURE:
			draft.removePostLoading = false;
			draft.removePostError = action.error;
			break;
		case ADD_COMMENT_REQUEST:
			draft.addCommentLoading = true;
			draft.addCommentDone = false;
			draft.addCommentError = null;
			break;
		case ADD_COMMENT_SUCCESS: {
			// console.log(action.data);
			const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
			// post.Comments.unshift(dummyComment(action.data.content));
			post.Comments.unshift(action.data);
			draft.addCommentLoading = false;
			draft.addCommentDone = true;
			break;
			// const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
			// const post = { ...state.mainPosts[postIndex] };
			// post.Comments = [dummyComment(action.data.content), ...post.Comments];
			// const mainPosts = [...state.mainPosts];
			// mainPosts[postIndex] = post;
			// return {
			//   ...state,
			//   mainPosts,
			//   addCommentLoading: false,
			//   addCommentDone: true,
			// };
		}
		case ADD_COMMENT_FAILURE:
			draft.addCommentLoading = false;
			draft.addCommentError = action.error;
			break;
		default:
			break;
	}
});

export default reducer;

// reducer 란, 이전 상태를 액션을 통해 다은 상태로 만들어내는 함수 (단, 불변성을 지키면서)
// immer는 state가 draft로 바뀌고 immer가 알아서 불변성 지켜서 state를 만들어 주기 때문에 draft를 조작하면 됨 (단, state를 조직하면 안됨)
// immer 쓸떄 배열은 unshift 사용 (ex. draft.mainPosts.unshift(dummyPost(action.data)) )
// immer 쓸떄 break 반드시 작성할 것
// 첫 화살표 return produce 를 의미함 : const reducer = (state = initialState, action) => produce(state, (draft) => {