const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const db = require("./models");
const app = express();
const passportConfig = require("./passport");
const passport = require('passport');
const dotenv = require('dotenv');

const cors = require("cors");


dotenv.config();

// db 연결용 코드
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공;");
  })
  .catch(console.error);

passportConfig(); // 로그인용

// 요청/응답 데이터 처리용 코드 (ex. req.body.{data}) - 위치 주의

// 아래는 개발용 임시 코드, 상용 배포시 제거
app.use(cors({
    // 아래 오류 해결을 위해 origin: "*" 설정 수정
    // 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.
    // origin: 'http://localhost:3060', 정확히 적거나 아래 처럼 true를 적거나
    origin: true,
    credentials: true, // 쿠키도 같이 전달하기 위해 true로 변경 (포스트 등록시 401)
}));

app.use(express.json()); // front에서 json 형 데이터 줘서 그거 용도
app.use(express.urlencoded({ extended: true })); // form - submit은 urlEncoded형식 데이터를 줘서 그거 용도
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET, // 쿠키에 보내주는 랜덤 문자열(ex. cxlhy) 복원용 키
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.send('hello express')
});



// 라우터를 추가 하자
app.use('/post', postRouter);
app.use('/user', userRouter);

// 에러처리 추가 가능


app.listen(3065, () => {
    console.log('*** 서버 실행 중 ***')
})

// node는 javascript런타임일 뿐 서버가 아니다
// 응답을 30초 내에 보내지 않으면 브라우저에서 실패라고 뜸

// postman으로 post 요청 테스트
// app. get, post, put, delete, patch, options, head


// express 없이 예제
// const http = require('http');
// const server = http.createServer((req,res) => {
//     console.log(req.url, req.method);
//     res.write('<h1>11</h1>');
//     res.write('22');
//     res.write('33');
//     res.end('hello node1')
//
// })
// server.listen(3065, () => {


// express 사용 예제
// app.get('/api', (req, res) => {
//     res.send('hello api1')
// });
//
// app.get('/api/posts', (req,res)=> {
//     res.json([
//         {id : 1, content: 'hello1'},
//         {id : 2, content: 'hello2'},
//         {id : 3, content: 'hello3'},
//     ])
// })