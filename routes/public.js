var express = require("express");
var router = express.Router();
const publicRouter = require("../controllers/public");

router.get("/", publicRouter.muro);

module.exports = router;
