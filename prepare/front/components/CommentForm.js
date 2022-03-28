import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Button, Form, Input } from "antd";
import useInput from "../hooks/useInput";
import { ADD_COMMENT_REQUEST } from "../reducers/post";

const CommentForm = ({ post }) => {
	const dispatch = useDispatch();

	const id = useSelector((state) => state.user.me?.id);
	const { addCommentDone, addCommentLoading } = useSelector((state) => state.post);
	const [commentText, onChangeCommentText, setCommentText] = useInput('');

	const onsubmitComment = useCallback(() => {
		console.log(post.id, commentText);
		dispatch({
			type: ADD_COMMENT_REQUEST,
			data: { content: commentText, postId: post.id, userId: id },
		});
	}, [commentText, id]);

	useEffect(() => {
		if (addCommentDone) {
			setCommentText('');
		}
	}, [addCommentDone]);


	return (
		<Form onFinish={onsubmitComment}>
			<Form.Item style={{ position: 'relative', margin: 0 }}>
				<Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
				<Button
					style={{ position: 'absolute', right: 0, bottom: -40 }}
					type="primary"
					htmlType="submit"
					loading={addCommentLoading}>
					삐약
				</Button>
			</Form.Item>
		</Form>
	);
}

CommentForm.propTypes = {
    post: PropTypes.object.isRequired,
};

export default CommentForm;
