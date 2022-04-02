import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Menu, Input, Row, Col } from "antd";
import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Router from "next/router";
import useInput from "../hooks/useInput";

const SearchInput = styled(Input.Search)`
	vertical-align: middle;
`;

const AppLayout = ({ children }) => {
	const { me } = useSelector((state) => state.user);
	const [searchInput, onChangeSearchInput] = useInput("");

	const onSearch = useCallback(() => {
		Router.push(`/hashtag/${searchInput}`);
	}, [searchInput]);

	return (
		<div>
			<Menu mode="horizontal">
				<Menu.Item>
					<Link href="/">
						<a>노드버드</a>
					</Link>
				</Menu.Item>
				<Menu.Item>
					<Link href="/profile">
						<a>프로필</a>
					</Link>
				</Menu.Item>
				<Menu.Item>
					<SearchInput
						enterButton
						value={searchInput}
						onChange={onChangeSearchInput}
						onSearch={onSearch}
					/>
				</Menu.Item>
				<Menu.Item>
					<Link href="/signup">
						<a>회원가입</a>
					</Link>
				</Menu.Item>
			</Menu>
			<Row gutter={8}>
				<Col xs={24} md={6}>
					{/* 왼쪽 메뉴 */}
					{me ? <UserProfile /> : <LoginForm />}
				</Col>
				<Col xs={24} md={12}>
					{children}
				</Col>
				<Col xs={24} md={6}>
					{/* 오른쪽 메뉴 */}
					<a
						href="https://github.com/choisee/advanced_react_nodebird"
						target="_black"
						rel="noreferrer noopener">
						Made by Choisee
					</a>
				</Col>
			</Row>
		</div>
	);
};

AppLayout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AppLayout;

// gutter 는 컬럼사이의 간격
// a태그의 target='_black'사용시 보안 이슈가 있을 수 있으니 반드시 rel='noreferrer noopener' 사용

// class에서는 component, container 나누어 사용
// hooks에서는 component 하나로 통합 추천

// 리렌더링이 일어나도 실제 변경된 항목만 다시 렌더링 됨
// 단 리렌더링도 너무 자주 일어나지 않도록 최적화 필요
