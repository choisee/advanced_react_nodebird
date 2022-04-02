const express = require("express");
const { Op } = require("sequelize");

const { User, Hashtag, Image, Post } = require("../models");

const router = express.Router();

router.get("/:tag", async (req, res, next) => {
  try {
    const where = {};
    // console.log('------req------5--', req)

    if (parseInt(req.query.lastId, 10)) {
      // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1

    // console.log('-----where-------5--', where)
    // console.log('------------5-decodeURIComponent(req.params.tag)-', decodeURIComponent(req.params.tag))

    const posts = await Post.findAll({
      where,
      limit: 10,
      include: [
        {
          model: Hashtag,
          where: { name: decodeURIComponent(req.params.tag) },
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
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
    res.json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
