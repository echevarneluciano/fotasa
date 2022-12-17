var express = require("express");
var router = express.Router();
const searchController = require("../controllers/search");

router.post("/", searchController.buscar);

module.exports = router;
