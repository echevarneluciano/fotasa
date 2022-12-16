var express = require("express");
var router = express.Router();
const likeController = require("../controllers/like");

router.post("/", likeController.likea);

module.exports = router;
