var express = require("express");
const { index } = require("../controllers");
var router = express.Router();
const indexController = require("../controllers/index");

/* GET home page. */
router.get("/", indexController.index);

module.exports = router;
