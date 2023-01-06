var { Img, Posteo, User, Like, Comentario } = require("../models");
const sizeOf = require("image-size");
const sequelize = require("sequelize");
const { Op, INTEGER } = require("sequelize");
const moment = require("moment");
var watermark = require("jimp-watermark");

exports.muro = async function (req, res) {
  let posts = await Posteo.findAll({
    include: [{ model: Img }, { model: User }, { model: Comentario }],
  });
  let imagenes = await Img.findAll({
    where: { userid: req.session.idusuario, tipo: "Sin publicar" },
  });

  let promedio = await Posteo.findAll({
    attributes: ["id"],
    raw: true,
    include: [
      {
        model: Like,
        attributes: [
          [sequelize.fn("avg", sequelize.col("estrellas")), "promedio"],
        ],
        required: true,
      },
    ],
    group: ["posteo.id"],
  });

  posts.map((p) => {
    p.dataValues.promedio = "datos insuficientes";
    promedio.map((pro) => {
      if (p.id == pro.id) {
        p.dataValues.promedio = pro["Likes.promedio"];
      }
    });
  });
  ///////////////////////////////
  let postsDesta = await Posteo.findAll({
    include: [
      { model: Img },
      { model: User },
      { model: Comentario },
      { model: Like },
    ],
    where: {
      createdAt: {
        [Op.between]: [
          moment().subtract(7, "days").format(),
          moment().format(),
        ],
      },
    },
  });
  postsDesta.map((p) => {
    p.dataValues.promedio = "datos insuficientes";
    promedio.map((pro) => {
      if (p.id == pro.id) {
        p.dataValues.promedio = pro["Likes.promedio"];
      }
    });
  });
  postsDesta = postsDesta.filter((p) => {
    if (p.Likes.length > 1 && parseInt(p.dataValues.promedio) > 4) {
      return true;
    }
  });
  ///////////////////////////////

  res.render("muro", {
    title: "Fotasa App",
    posts: posts,
    postsDesta: postsDesta,
    imagenes: imagenes,
    nick: req.session.nickusuario,
  });
};

exports.detalles = async function (req, res) {
  let post = await Posteo.findByPk(req.params.id, {
    include: [{ model: Img }, { model: User }, { model: Comentario }],
  });
  res.render("detalles", {
    title: "Fotasa App",
    post: post,
    nick: req.session.nickusuario,
  });
};

exports.publicar = async (req, res) => {
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
    if (req.body.Etiqueta1 && req.body.Etiqueta2 && req.body.Etiqueta3) {
      return `#${req.body.Etiqueta1}#${req.body.Etiqueta2}#${req.body.Etiqueta3}`;
    } else if (req.body.Etiqueta1 && req.body.Etiqueta2) {
      return `#${req.body.Etiqueta1}#${req.body.Etiqueta2}`;
    } else return `#${req.body.Etiqueta1}`;
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
};

exports.imagenPersonal = async (req, res) => {
  let ruta = req.file.path.split("public")[1];
  let imgbd = {
    url: ruta,
    tipo: "Sin publicar",
    userid: req.session.idusuario,
  };
  await Img.create(imgbd);
  res.redirect("/muro");
};
