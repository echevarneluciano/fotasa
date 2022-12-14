var express = require("express");
var router = express.Router();
var { Img, Posteo, User, Like, Comentario } = require("../models");
const sizeOf = require("image-size");
const multer = require("multer");
const SharpMulter = require("sharp-multer");
const { Op } = require("sequelize");
var watermark = require("jimp-watermark");

const storage = SharpMulter({
  destination: (req, file, callback) => callback(null, "public/images"),
  imageOptions: {
    fileFormat: "jpg",
    quality: 100,
    //resize: { width: 500, height: 500 },
  },
});
const upload = multer({ storage });

router.get("/", async function (req, res) {
  let posts = await Posteo.findAll({
    include: [{ model: Img }, { model: User }, { model: Comentario }],
  });
  let imagenes = await Img.findAll({
    where: { userid: req.session.idusuario, tipo: "Sin publicar" },
  });
  res.render("muro", {
    title: "Fotasa App",
    posts: posts,
    imagenes: imagenes,
    nick: req.session.nickusuario,
  });
});

router.post("/upload", upload.single("imagen"), async (req, res) => {
  let tipoF = () => {
    if (req.body.derechos == "Dominio Publico" && req.body.tipo == "Publico") {
      return "Publico";
    } else return "Privado";
  };

  if (req.body.imagenmarca != "") {
    let options = { dstPath: `${req.file.path}` };
    watermark.addWatermark(
      req.file.path,
      `public${req.body.imagenmarca}`,
      options
    );
  }

  let ruta = req.file.path.split("public")[1];
  let imgbd = {
    url: ruta,
    derechos: req.body.derechos,
    tipo: tipoF(),
    info: req.file.mimetype,
    userid: req.session.idusuario,
  };
  let imgCreada = await Img.create(imgbd);
  let etiqueta = () => {
    if (
      req.body.Etiquetas[0] &&
      req.body.Etiquetas[1] &&
      req.body.Etiquetas[2]
    ) {
      return `#${req.body.Etiquetas[0]}#${req.body.Etiquetas[1]}#${req.body.Etiquetas[2]}`;
    } else if (req.body.Etiquetas[0] && req.body.Etiquetas[1]) {
      return `#${req.body.Etiquetas[0]}#${req.body.Etiquetas[1]}`;
    } else return `#${req.body.Etiquetas[0]}`;
  };
  let posteobd = {
    imgid: imgCreada.id,
    userid: req.session.idusuario,
    categoria: req.body.Categoria,
    titulo: req.body.titulo,
    tipo: tipoF(),
    etiquetas: etiqueta(),
  };
  await Posteo.create(posteobd);
  try {
    sizeOf(req.file.path, async function (err, dimensions) {
      if (dimensions == undefined) {
      } else
        await Img.update(
          {
            info: `Alto: ${dimensions.width}, ancho: ${dimensions.width}, tipo: ${dimensions.type}`,
          },
          { where: { id: imgCreada.id } }
        );
    });
  } catch (error) {
    console.log(error);
  }
  res.redirect("/muro");
});

router.post(
  "/upload/personal",
  upload.single("imagenpersonal"),
  async (req, res) => {
    let ruta = req.file.path.split("public")[1];
    let imgbd = {
      url: ruta,
      tipo: "Sin publicar",
      userid: req.session.idusuario,
    };
    await Img.create(imgbd);
    res.redirect("/muro");
  }
);

router.post("/like", async function (req, res) {
  let likeBD = {
    estrellas: parseInt(req.body.estrellas),
    posteoid: parseInt(req.body.posteoid),
    userid: req.session.idusuario,
  };
  let busca = await Like.findOne({
    where: { userid: likeBD.userid, posteoid: likeBD.posteoid },
  });
  if (!busca) {
    await Like.create(likeBD);
  }
});

router.post("/", async function (req, res) {
  let comentarBD = {
    descripcion: `${req.session.nickusuario}: ${req.body.comentario}`,
    userid: req.session.idusuario,
    posteoid: req.body.postid,
  };
  let comentario = await Comentario.create(comentarBD);
  res.json(comentario);
});

router.get("/perfil", async function (req, res) {
  let usuario = await User.findByPk(req.session.idusuario);
  res.render("perfil", {
    title: `Perfil de ${req.session.nickusuario}`,
    usuario: usuario,
    nick: req.session.nickusuario,
  });
});

router.post("/perfil", async function (req, res) {
  let usuario = await User.update(
    {
      nombre: req.body.nombre,
      intereses: req.body.intereses,
    },
    { where: { id: req.body.id } }
  );
  res.redirect("/muro/perfil");
});

router.post("/buscar", async function (req, res) {
  var options = {
    where: {
      [Op.or]: [
        { titulo: { [Op.like]: "%" + req.body.palabraclave + "%" } },
        { etiquetas: { [Op.like]: "%" + req.body.palabraclave + "%" } },
      ],
    },
    include: [{ model: Img }, { model: User }, { model: Comentario }],
  };

  let buscador = await Posteo.findAll(options);
  res.render("buscados", {
    title: "Fotasa App",
    posts: buscador,
    nick: req.session.nickusuario,
  });
});

module.exports = router;
