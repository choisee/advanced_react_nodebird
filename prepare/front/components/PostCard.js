import React, { useCallback, useState } from "react";
import { Avatar, Button, Card, Comment, Image, List, Popover } from "antd";
import PropTypes from "prop-types";
import {
	EllipsisOutlined,
	HeartOutlined,
	HeartTwoTone,
	MessageOutlined,
	RetweetOutlined,
} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import PostImages from "./PostImages";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import {REMOVE_POST_REQUEST} from "../reducers/post";

const PostCard = ({post}) => {

	const dispatch = useDispatch();
	const [liked, setLiked] = useState(false);
	const [commentFormOpened, setCommentFormOpened] = useState(false);

	const onToggleLike = useCallback(() => {
		setLiked((prev) => !prev);
	}, [])

	const onToggleComment = useCallback(() => {
		setCommentFormOpened((prev) => !prev);
	}, [])

	const onRemovePost = useCallback(() => {
		dispatch({
			type: REMOVE_POST_REQUEST,
			data: post.id,
		})
	}, []);


	const id = useSelector((state) => state.user.me?.id);
	// const id = me?.id; // optional chaining 연산자
	const { removePostLoading } = useSelector((state) => state.post);

	return (
		<div style={{marginBottom: 20}}>
			<Card
			cover={post.Images[0] && <PostImages images={post.Images} />}
			actions={[
				<RetweetOutlined key="retweet" />,
				liked
					? <HeartTwoTone twoToneColor='#eb2f96' key="heart" onClick={onToggleLike} />
					: <HeartOutlined key="heart" onClick={onToggleLike} />,
				<MessageOutlined key="comment" onClick={onToggleComment}/>,
				<Popover key="more" content={(
					<Button.Group>
						{id && post.User.id === id ? (
							<>
								<Button>수정</Button>
								<Button type='danger' loading={removePostLoading} onClick={onRemovePost}>삭제</Button>
							</>
						) : <Button>신고</Button>}
					</Button.Group>
				)}>
					<EllipsisOutlined />
				</Popover>,
			]}
			>
				<Card.Meta
					avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
					title={post.User.nickname}
					description={<PostCardContent postData={post.content}/>}
				/>
			</Card>
			{commentFormOpened && (
				<div>
					<CommentForm post={post} />
					<List
					style={{marginTop: 40}}
					header={`${post.Comments.length}개의 댓글`}
					itemLayout='horizontal'
					dataSource={post.Comments}
					renderItem={(item) => (
						<li>
							<Comment
								author={item.User.nickname}
								avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
								content={item.content}
							/>
						</li>

					)}
					/>

				</div>
			)}
			{/*<Comments />*/}
		</div>
	);
};
PostCard.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number,
		User: PropTypes.object,
		content: PropTypes.string,
		createdAt: PropTypes.object,
		Comments: PropTypes.arrayOf(PropTypes.object),
		Images: PropTypes.arrayOf(PropTypes.object),
	}).isRequired,
}
export default PostCard;
