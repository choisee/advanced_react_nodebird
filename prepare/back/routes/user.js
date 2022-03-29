const express = require('express');
const bcrypt = require('bcrypt');
const {User} = require('../models') // db.User
const router = express.Router();

// POST /user
router.post('/', async(req,res, next) => {

    try {
        // 비동기면 await 추가, 호출 순서 보장을 위함
        // 비동기 여부는 공식 문서들 확인
        // 동일 email 사용자가 있는지 확인
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            }
        })

        // 이미 사용중인 아이디일 경우 처리
        if(exUser){
            return res.status(403).send('이미 사용 중인 아이디입니다.')
        }

        // 신규 회원 가입 처리
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,
        });
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060'); // 3060 브라우저에서 온 요청은 허용하겠다
        res.status(201).send('ok');

    } catch (error) {
        console.error(error);
        next(error); // 에러가 한방에 처리됨 - express > browser로 전달함
    }

});

module.exports = router;
