import React from "react";
import AppLayout from "../components/AppLayouts";

const Home = () => {
  return (
    <AppLayout>
      <div>Hello, Next!</div>
    </AppLayout>
  );
};
export default Home;

// nextjs 에서는 import React ~~ 를 할 필요가 없음
// nextjs는 무조건 pages 여야함, pages 하위를 모두 페이지로 만들어 줌, pages 폴더명은 꼭 지킬 것

// 각 페이지별로 레이아웃을 다르게 적용할 수 있음
// <AppLayout> <div>Hello, Next!</div> </AppLayout> 처럼 페이지를 만든 레이아웃으로 감싸면 됨
