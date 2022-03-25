import React, {useCallback} from "react";
import AppLayout from "../components/AppLayouts";
import Head from "next/head";
import {Button, Card, Avatar} from "antd";

const UserProfile = ({setIsLoggedIn}) => {
    const onLogOut = useCallback(() => {
        setIsLoggedIn(false);
    },[]);

    return (
        <>
        <Card actions = {[
            <div key="twit">짹짹<br />0</div>,
            <div key="followings">팔로잉<br />0</div>,
            <div key="followers">팔로워<br />0</div>

        ]}>
            <Card.Meta avatar={<Avatar>CS</Avatar>} title="choisee"/>
            <Button onClick={onLogOut}>로그아웃</Button>
        </Card>
            {/*
            <Head>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                <div>내 프로필</div>
            </AppLayout>
            */}
        </>

    );
}

export default UserProfile;
