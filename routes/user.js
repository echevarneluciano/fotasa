var express = require("express");
var router = express.Router();
const userController = require("../controllers/user");

router.get("/perfil", userController.perfil);
router.post("/perfil", userController.actualizar);

module.exports = router;
