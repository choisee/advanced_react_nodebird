

export const initialState = {
    mainPosts: [{
        id: 1,
        User: {
            id: 1,
            nickname: 'choisee',
        },
        content: '첫번때 게시글 #해시태그',
        Images: [{
            src:'https://www.google.com/url?sa=i&url=http%3A%2F%2Fm.blog.naver.com%2Fkrazymouse%2F220610172701&psig=AOvVaw1rcJTJ3D9KnRmFWxrUf7WD&ust=1648350001173000&source=images&cd=vfe&ved=2ahUKEwiH6Maz5OL2AhVHx2EKHXhPDYQQjRx6BAgAEAk'
        },{
            src:'https://www.google.com/url?sa=i&url=https%3A%2F%2Fm.facebook.com%2F534554896658180%2Fphotos%2F1894679570645699%2F&psig=AOvVaw1rcJTJ3D9KnRmFWxrUf7WD&ust=1648350001173000&source=images&cd=vfe&ved=0CAkQjRxqFwoTCMDbj7vk4vYCFQAAAAAdAAAAABAK'
        },{
            src:'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.copin.co.kr%2FblogPost%2Fkakaofriends-chunsik&psig=AOvVaw0XGH7d6DxoD18yOjYjUIf0&ust=1648350112876000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCMCktezk4vYCFQAAAAAdAAAAABAD'
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