import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { StopOutlined } from "@ant-design/icons";
import { List, Button, Card } from "antd";
import { useDispatch } from "react-redux";

import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from "../reducers/user";

const FollowList = ({ header, data, onClickMore, loading }) => {
	const dispatch = useDispatch();
	const onCancel = (id) => () => {
		if (header === "팔로잉") {
			dispatch({
				type: UNFOLLOW_REQUEST,
				data: id,
			});
		}
		dispatch({
			type: REMOVE_FOLLOWER_REQUEST,
			data: id,
		});
	};

	const styleGrid = useMemo(() => ({ gutter: 4, xs: 2, md: 3 }), []);
	const styleList = useMemo(() => ({ marginBottom: 20 }), []);
	const styleListItem = useMemo(() => ({ marginTop: 20 }), []);
	const styleListDiv = useMemo(() => ({ textAlign: "center", margin: "10px 0" }), []);

	return (
		<List
			grid={styleGrid}
			style={styleList}
			size="small"
			header={<div>{header}</div>}
			loadMore={
				<div style={styleListDiv}>
					<Button onClick={onClickMore} loading={loading}>
						더 보기
					</Button>
				</div>
			}
			bordered
			dataSource={data}
			renderItem={(item) => (
				<List.Item style={styleListItem}>
					<Card actions={[<StopOutlined key="stop" onClick={onCancel(item.id)} />]}>
						<Card.Meta description={item.nickname} />
					</Card>
				</List.Item>
			)}></List>
	);
};

FollowList.propTypes = {
	header: PropTypes.string.isRequired,
	data: PropTypes.array.isRequired,
	onClickMore: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};

export default FollowList;
