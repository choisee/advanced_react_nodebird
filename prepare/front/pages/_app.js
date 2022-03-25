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
            </Head>
            {/*<div>공통 메뉴</div>*/}
            <Component/>
            {/*</Provider>*/}
        </>
    );
}

NodeBird.propTypes = {
    Component: PropTypes.elementType.isRequired,
}

export default wrapper.withRedux(NodeBird);

// index.js의 부모
