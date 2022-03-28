import shortId from 'shortid'

export const initialState = {
    mainPosts: [{
        id: 1,
        User: {
            id: 1,
            nickname: 'choisee',
        },
        content: '첫번때 게시글 #해시태그',
        Images: [{
            src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
        }, {
            src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
        }, {
            src: 'https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg',
        }],
        Comments: [{
            User : {
                nickname: 'sugar'
            },
            content: '오 롸이언',
        },{
            User : {
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


export const addPost = (data) => ({
    type: ADD_POST_REQUEST,
    data,
});

export const addComment = (data) => ({
    type: ADD_COMMENT_REQUEST,
    data,
});

const dummyPost = (data) => ({
	id: shortId.generate(), // make id in random
	content: data,
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
					addPostLoading: false,
					addPostDone: false,
					addPostError: null,
				};
			case ADD_POST_REQUEST:
				console.log('reduces-post-ADD_POST_REQUEST');
				return {
					...state,
					addPostLoading: true,
					mainPosts: [dummyPost(action.data), ...state.mainPosts], // dummyPost 게시글 최상단에 추가되게 처리함
					addPostDone: true,
				};
			case ADD_POST_FAILURE:
				return {
					...state,
					addPostLoading: false,
					addPostError: action.error,
				};

			case ADD_COMMENT_SUCCESS: {
				const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
				const post = { ...state.mainPosts[postIndex] };
				post.Comments = [dummyComment(action.data.content), ...post.Comments];
				const mainPosts = [...state.mainPosts];
				mainPosts[postIndex] = post;
				return {
					...state,
					mainPosts,
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