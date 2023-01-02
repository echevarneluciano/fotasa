var { Img, Posteo, User, Like, Comentario } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

exports.muro = exports.muro = async function (req, res) {
  let posts = await Posteo.findAll({
    where: { tipo: "Publico" },
    include: [{ model: Img }, { model: User }, { model: Comentario }],
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

  res.render("publicMuro", {
    title: "Fotasa App",
    posts: posts,
    nick: req.session.nickusuario,
  });
};

exports.buscar = async function (req, res) {
  var options = {
    where: {
      [Op.or]: [
        { titulo: { [Op.like]: "%" + req.body.palabraclave + "%" } },
        { etiquetas: { [Op.like]: "%" + req.body.palabraclave + "%" } },
      ],
      [Op.and]: [{ tipo: "Publico" }],
    },
    include: [{ model: Img }, { model: User }, { model: Comentario }],
  };

  let buscador = await Posteo.findAll(options);

  let promedio = await Posteo.findAll({
    attributes: ["id"],
    raw: true,
    where: {
      [Op.or]: [
        { titulo: { [Op.like]: "%" + req.body.palabraclave + "%" } },
        { etiquetas: { [Op.like]: "%" + req.body.palabraclave + "%" } },
      ],
      [Op.and]: [{ tipo: "Publico" }],
    },
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
  buscador.map((p) => {
    p.dataValues.promedio = "datos insuficientes";
    promedio.map((pro) => {
      if (p.id == pro.id) {
        p.dataValues.promedio = pro["Likes.promedio"];
      }
    });
  });

  res.render("buscadosPublic", {
    title: "Fotasa App",
    posts: buscador,
  });
};
