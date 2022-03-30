import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Form, Input, Button } from "antd";
import Link from "next/link";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { loginRequestAction } from "../reducers/user";

const ButtonWrapper = styled.div`
	margin-top: 10px;
`;

// const FormWrapper = styled(Form)`
// 	padding: 10px;
// `;

const LoginForm = () => {
	const dispatch = useDispatch();
	const { logInLoading, logInError } = useSelector((state) => state.user);

	const [email, onChangeEmail] = useInput('');
	const [password, onChangePassword] = useInput('');

    useEffect(() => {
        console.log('LoginForm', logInError);
        if (logInError) {
            alert(logInError);
        }
    }, [logInError]);

	// 커스텀 훅 적용
	// const [id, setId] = useState("");
	// const [password, setPassword] = useState("");
	//
	// const onChangeId = useCallback((e) => {
	// 	setId(e.target.value);
	// }, []);
	// const onChangePassword = useCallback((e) => {
	// 	setPassword(e.target.value);
	// }, []);

	const styles = useMemo(() => ({ paddingBottom: '5px' }), []);
	const loginFormstyles = useMemo(() => ({ padding: '10px' }), []);

	const onSubmitForm = useCallback(() => {
		// e.preventDefault(); // 이미 적용되어있어서 생략
		console.log(email, password);
		dispatch(loginRequestAction({ email, password }));
	}, [email, password]);

	return (
  <Form style={loginFormstyles} onFinish={onSubmitForm}>
    <div>
      <label htmlFor="user-email">이메일</label>
      <br />
      <input name="user-email" value={email} onChange={onChangeEmail} required />
    </div>
    <div>
      <label htmlFor="user-password">비밀번호</label>
      <br />
      <Input name="user-password" type="password" value={password} onChange={onChangePassword} required />
    </div>
    <ButtonWrapper style={styles}>
      <Button type="primary" htmlType="submit" loading={logInLoading}>
        로그인
      </Button>
      <Link href="/signup">
        <a>
          <Button>회원가입</Button>
        </a>
      </Link>
    </ButtonWrapper>
  </Form>
	);
};

export default LoginForm;

// <div style={{ marginTop : 10 }}> 이렇게 스타일링 하지 말것, 객체를 리렌더링시 계속 생성함
// style은 ButtonWrapper 혹은 useMemo로 감싸서 따로 분리한걸 사용하자

// 리렌더링 될때 return 내부에서 바뀐부분만 리렌더링함
