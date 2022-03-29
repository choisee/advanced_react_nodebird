const express = require('express');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const app = express();
const cors = require('cors');

// db 연결용 코드
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공;");
  })
  .catch(console.error);

// 요청/응답 데이터 처리용 코드 (ex. req.body.{data}) - 위치 주의

// 아래는 개발용 임시 코드, 상용 배포시 제거
app.use(cors({
    origin: '*',
    credentials: false,
}));

app.use(express.json()); // front에서 json 형 데이터 줘서 그거 용도
app.use(express.urlencoded({ extended: true })); // form - submit은 urlEncoded형식 데이터를 줘서 그거 용도





app.get('/', (req, res) => {
    res.send('hello express1')
});





// 라우터를 추가 하자
app.use('/post', postRouter);
app.use('/user', userRouter);



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