import React, { useCallback, useState, useMemo } from "react";
import Head from "next/head";
import {Button, Checkbox, Form, Input} from "antd";
import useInput from "../hooks/useInput";
import AppLayout from "../components/AppLayouts";
import styled from "styled-components";
import {SIGN_UP_REQUEST} from "../reducers/user";
import {useDispatch, useSelector} from "react-redux";

const ErrorMessage = styled.div`
    color:red;
`

const Signup = () => {
	const dispatch = useDispatch();
	const {signUpLoading} = useSelector((state) => state.user);

	const styleBtn = useMemo(() => ({ marginTop: 10 }), []);

	const [email, onChangeEmail] = useInput("");
	const [nickname, onChangeNickname] = useInput("");
	const [password, onChangePassword] = useInput("");

	const [passwordError, setPasswordError] = useState(false);
	const [passwordCheck, setPasswordCheck] = useState("");
	const onChangePasswordCheck = useCallback(
		(e) => {
			setPasswordCheck(e.target.value);
			setPasswordError(e.target.value !== password);
		},
		[password],
	);

	const [term, setTerm] = useState(false);
	const [termError, setTermError] = useState(false);
	const onChangeTerm = useCallback(
		(e) => {
			setTerm(e.target.checked);
			setTermError(false);
		},
		[term],
	);

	// 커스텀 훅 적용
	// const[id, setId] = useState('');
	// const onChangeId = useCallback((e) => {
	//     setId(e.target.value);
	// },[])
	//
	// const[nickname, setNickname] = useState('');
	// const onChangeNickname = useCallback(() => {
	//     setNickname(e.target.value);
	//
	// },[])
	//
	// const[password, setPassword] = useState('');
	// const onChangePassword = useCallback(() => {
	//     setPassword(e.target.value);
	// },[])

	const onSubmit = useCallback(() => {
		if (password !== passwordCheck) {
			return setPasswordError(true);
		}
		console.log(term);
		if (!term) {
			return setTermError(true);
		}
		console.log(email, nickname, password);
		dispatch({
			type: SIGN_UP_REQUEST,
			data: {email, password, nickname}
		})
	}, [email, nickname, password, term]);

	return (
		<AppLayout>
			<Head>
				<title>회원가입 | NodeBird</title>
			</Head>
			<Form onFinish={onSubmit}>
				<div>
					<label htmlFor="user-email">이메일</label>
					<br />
					<Input name="user-email" type="email" value={email} required onChange={onChangeEmail} />
				</div>

				<div>
					<label htmlFor="user-nickname">닉네임</label>
					<br />
					<Input name="user-nickname" value={nickname} required onChange={onChangeNickname} />
				</div>

				<div>
					<label htmlFor="user-password">비밀번호</label>
					<br />
					<Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
				</div>

				<div>
					<label htmlFor="user-password">비밀번호</label>
					<br />
					<Input name="user-password" type="password" value={passwordCheck} required onChange={onChangePasswordCheck} />
					{passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
				</div>

				<div>
					<Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
						개인약관은 없지만 동의한 것으로 간주하겠습니다.
					</Checkbox>
					{termError && <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage>}
				</div>
				<div style={styleBtn}>
					<Button type="primary" htmlType="submit" loading={signUpLoading} >
						가입하기
					</Button>
				</div>
			</Form>
		</AppLayout>
	);
};

export default Signup;
