var express = require("express");
var router = express.Router();
const multer = require("multer");
const SharpMulter = require("sharp-multer");
const muroController = require("../controllers/muro");

const storage = SharpMulter({
  destination: (req, file, callback) => callback(null, "public/images"),
  imageOptions: {
    fileFormat: "jpg",
    quality: 100,
    //resize: { width: 500, height: 500 },
  },
});
const upload = multer({ storage });

router.get("/", muroController.muro);

router.get("/detalles/:id", muroController.detalles);

router.post("/upload", upload.single("imagen"), muroController.publicar);

router.post(
  "/upload/personal",
  upload.single("imagenpersonal"),
  muroController.imagenPersonal
);

router.post("/", async function (req, res) {
  let comentarBD = {
    descripcion: `${req.session.nickusuario}: ${req.body.comentario}`,
    userid: req.session.idusuario,
    posteoid: req.body.postid,
  };
  let comentario = await Comentario.create(comentarBD);
  res.json(comentario);
});

module.exports = router;
