const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { Op } = require("sequelize");

const { User, Post, Comment, Image } = require("../models"); // db.User
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();

// GET /user
router.get("/", async (req, res, next) => {
  // GET /user
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /user
router.post("/", isNotLoggedIn, async (req, res, next) => {
  try {
    // 비동기면 await 추가, 호출 순서 보장을 위함
    // 비동기 여부는 공식 문서들 확인
    // 동일 email 사용자가 있는지 확인
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // 이미 사용중인 아이디일 경우 처리
    if (exUser) {
      return res.status(403).send("이미 사용 중인 아이디입니다.");
    }

    // 신규 회원 가입 처리
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060'); // 3060 브라우저에서 온 요청은 허용하겠다
    res.status(201).send("ok");
  } catch (error) {
    console.error(error);
    next(error); // 에러가 한방에 처리됨 - express > browser로 전달함
  }
});

// 미들웨어 확장법 (req, rex, next) => {passport.authenticate... } 사용 : express 문법
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason); // 401 - 허가 되지 않음 (HTTP status code)
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
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
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"], // 특정 데이터만 가지고 옴 (User의 id 컬럼 데이터만 필요함)
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // PATCH /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 팔로우하려고 하시네요?");
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // DELETE /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 언팔로우하려고 하시네요?");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  // DELETE /user/follower/2
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 차단하려고 하시네요?");
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followers", isLoggedIn, async (req, res, next) => {
  // GET /user/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send("없는 사람을 찾으려고 하시네요?");
    }
    const followers = await user.getFollowers({
      attributes: ["id", "nickname"],
      limit: parseInt(req.query.limit, 10),
    });
    // const followers = await user.getFollowers();
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
  // GET /user/followings
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send("없는 사람을 찾으려고 하시네요?");
    }
    const followings = await user.getFollowings({
      attributes: ["id", "nickname"],
      limit: parseInt(req.query.limit, 10),
    });
    // const followings = await user.getFollowings();
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  // GET /user/3
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followings",
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followers",
          attributes: ["id"],
        },
      ],
    });
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON();
      data.Posts = data.Posts.length;
      data.Followings = data.Followings.length;
      data.Followers = data.Followers.length;
      res.status(200).json(data);
    } else {
      res.status(404).json("존재하지 않는 사용자입니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:id/posts", async (req, res, next) => {
  // GET /user/1/posts
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (user) {
      const where = {};
      if (parseInt(req.query.lastId, 10)) {
        // 초기 로딩이 아닐 때
        where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
      } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
      const posts = await user.getPosts({
        where,
        limit: 10,
        include: [
          {
            model: Image,
          },
          {
            model: Comment,
            include: [
              {
                model: User,
                attributes: ["id", "nickname"],
              },
            ],
          },
          {
            model: User,
            attributes: ["id", "nickname"],
          },
          {
            model: User,
            through: "Like",
            as: "Likers",
            attributes: ["id"],
          },
          {
            model: Post,
            as: "Retweet",
            include: [
              {
                model: User,
                attributes: ["id", "nickname"],
              },
              {
                model: Image,
              },
            ],
          },
        ],
      });
      // console.log(posts);
      res.status(200).json(posts);
    } else {
      res.status(404).send("존재하지 않는 사용자입니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// about
router.get("/:userId", async (req, res, next) => {
  // GET /user
  try {
    // console.log('/:userId-----req.user-----',req.user)
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      if (fullUserWithoutPassword) {
        const data = fullUserWithoutPassword.toJSON();
        data.Posts = data.Posts.length; // 개인정보 침해예방
        data.Followers = data.Posts;
        data.Followings = data.Posts;
        // data.Followers = data.Posts.length;
        // data.Followings = data.Posts.length;
        // console.log('/:userId----------',data)
        res.status(200).json(data);
      }
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
