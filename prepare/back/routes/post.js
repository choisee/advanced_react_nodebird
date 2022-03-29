const express = require('express')
const router = express.Router();

// POST /post
router.post('/', (req, res) => {
    res.json({id: 1, content: 'hello post1'})
})

// DELETE /post
router.delete('/', (req, res) => {
    res.json({id: 1, content: 'helld post1'})
})

module.exports = router;