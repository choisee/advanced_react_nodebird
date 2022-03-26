import React, { useCallback } from "react";
import { Button, Form, Input } from "antd";
import useInput from "../hooks/useInput";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";


const CommentForm = ({post}) => {
    const id = useSelector((state) => state.user.me?.id);
    const [commentText, onChangeCommentText] = useInput('');
    const onsubmitComment = useCallback(() => {
        console.log(post.id, commentText);
    },[commentText])

    return (
			<Form onFinish={onsubmitComment}>
				<Form.Item style={{ position: "relative", margin: 0 }}>
					<Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
					<Button
						style={{ position: "absolute", right: 0, bottom: -40 }}
						type="primary"
						htmlType="submit">
						삐약
					</Button>
				</Form.Item>
			</Form>
		);
}

CommentForm.PropTypes = {
    post: PropTypes.object.isRequired,
}

export default CommentForm;