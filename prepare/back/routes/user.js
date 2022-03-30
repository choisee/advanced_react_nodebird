const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const { User, Post } = require('../models'); // db.User
const router = express.Router();

// 미들웨어 확장법 (req, rex, next) => {passport.authenticate... } 사용 : express 문법
router.post('/login', (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {

        if(err) {
            return next(err);
        }
        if (info) {
            return res.status(401).send(info.reason); // 401 - 허가 되지 않음 (HTTP status code)
        }
        return req.login(user, async (loginErr) => {

            if(loginErr){
                return next(loginErr);
            }
            // 서버에서 랜덤한 문자열 쿠키를 클라이언트로 보내주어, 클라이언트에서 해당 쿠키를 헤더에 넣어 요청할때 사용자임을 인증함
            // 사용자의 모든 정보를 쿠키에 들고있으면 서버도 무거워, passport에서는 ID 만 들고 있고, 필요할때 ID 1에 해당한느 유저 정보를 조회 함
            // 추후 세션용 redis 사용
            // res.Header('Cookie', 'cxlhy')

            // return res.status(200).json(user);
            const fullUserWithoutPassword = await User.findOne({
                where: { id: user.id },
                attributes: {
                    exclude: ['password']
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }]
            })
            return res.status(200).json(fullUserWithoutPassword);
        })

    })(req,res,next);
});



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
