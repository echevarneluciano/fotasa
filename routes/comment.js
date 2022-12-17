var express = require("express");
var router = express.Router();
const commentController = require("../controllers/comment");

router.post("/", commentController.comentar);

module.exports = router;
