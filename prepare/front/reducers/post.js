

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
    postAdded: false,
}

const ADD_POST = "ADD_POST";
export const addPost = {
	type: ADD_POST,
};
const dummyPost = {
	id: 2,
	content: "더미데이터임",
	User: {
		id: 1,
		nickname: "choisee2",
	},
	Images: [],
	Comments: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST:
            return {
                ...state,
                mainPosts: [dummyPost, ...state.mainPosts] // dummyPost 게시글 최상단에 추가되게 처리함
            }
        default:
            return state;

    }
};

export default reducer;