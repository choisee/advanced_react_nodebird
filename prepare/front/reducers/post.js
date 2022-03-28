import shortId from 'shortid'

export const initialState = {
    mainPosts: [{
        id: 1,
        User: {
            id: 1,
            nickname: 'choisee',
        },
        content: '첫번째 게시글 #해시태그',
        Images: [{
			id: shortId.generate(),
            src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
        }, {
			id: shortId.generate(),
            src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
        }, {
			id: shortId.generate(),
            src: 'https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg',
        }],
        Comments: [{
			id: shortId.generate(),
            User : {
				id: shortId.generate(),
                nickname: 'sugar'
            },
            content: '오 롸이언',
        },{
			id: shortId.generate(),
            User : {
				id: shortId.generate(),
                nickname: 'salt'
            },
            content: '오 춘식쓰',
        }]
    }],
    imagePaths: [],
    addPostLoading: false,
    addPostDone: false,
    addPostError: null,
    removePostLoading: false,
    removePostDone: false,
    removePostError: null,
    addCommentLoading: false,
    addCommentDone: false,
    addCommentError: null,
}

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

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

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_POST_SUCCESS:
			return {
				...state,
				mainPosts: [dummyPost(action.data), ...state.mainPosts], // dummyPost 게시글 최상단에 추가되게 처리함
				addPostLoading: false,
				addPostDone: true,
				addPostError: null,
			};
		case ADD_POST_REQUEST:
			console.log("reduces-post-ADD_POST_REQUEST");
			return {
				...state,
				addPostLoading: true,
				addPostDone: false,
				addPostError: null,
			};
		case ADD_POST_FAILURE:
			return {
				...state,
				addPostLoading: false,
				addPostError: action.error,
			};


		case REMOVE_POST_REQUEST:
			return {
				...state,
				removePostLoading: true,
				removePostDone: false,
				removePostError: null,
			};
		case REMOVE_POST_SUCCESS:
			console.log('REMOVE_POST_SUCCESS--', state)
			return {
				...state,
				removePostLoading: false,
				removePostDone: true,
				mainPosts: state.mainPosts.filter((v) => v.id !== action.data),
			};
		case REMOVE_POST_FAILURE:
			return {
				removePostLoading: false,
				removePostError: action.error,
			};

		case ADD_COMMENT_SUCCESS: {
			const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
			const post = { ...state.mainPosts[postIndex] };
			post.Comments = [dummyComment(action.data.content), ...post.Comments];
			const mainPosts = [...state.mainPosts];
			mainPosts[postIndex] = post;
			return {
				...state,
				mainPosts : mainPosts,
				addCommentLoading: false,
				addCommentDone: true,
			};
		}
		case ADD_COMMENT_REQUEST:
			return {
				...state,
				addCommentLoading: true,
				addCommentDone: false,
				addCommentError: null,
			};
		case ADD_COMMENT_FAILURE:
			return {
				...state,
				addCommentLoading: false,
				addCommentError: action.error,
			};

		default:
			return state;
	}
};

export default reducer;