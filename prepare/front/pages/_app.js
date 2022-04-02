import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import "antd/dist/antd.css";
import wrapper from "../store/configureStore";

const NodeBird = ({ Component }) => {
	return (
		<>
			{/*<Provider> //기존 redix 사용법*/}
			<Head>
				{/*<meta charSet='utf-8'/>*/}
				<title>NodeBird</title>
				<link rel="shortcut icon" href="/favicon.ico" />
			</Head>
			{/*<div>공통 메뉴</div>*/}
			<Component />
			{/*</Provider>*/}
		</>
	);
};

NodeBird.propTypes = {
	Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(NodeBird);

// index.js의 부모

// next SSR용 4가지 메서드 제공 - redux와 같이 사용하면 문제가 있음 > next-redux-wrapper가 제공하는 SSR메서드와 사용하는게 좋음
