import React from "react";
import AppLayout from "../components/AppLayouts";
import Head from "next/head";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";


const Profile = () => {

    const followerList = [{ nickname:'aa1' }, { nickname:'aa2' }, { nickname:'aa3' }];
    const followingList = [{ nickname:'bb1' }, { nickname:'bb2' }, { nickname:'bb3' }];

    return (
        <>
            <Head>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                <NicknameEditForm />
                <FollowList header="팔로잉 목록" data={followerList} />
                <FollowList header="팔로워 목록" data={followingList} />
            </AppLayout>
        </>
    );
}

export default Profile;
