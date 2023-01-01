var { Img, Posteo, User, Comentario, Like } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

exports.buscar = async function (req, res) {
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

  let promedio = await Posteo.findAll({
    attributes: ["id"],
    raw: true,
    where: {
      [Op.or]: [
        { titulo: { [Op.like]: "%" + req.body.palabraclave + "%" } },
        { etiquetas: { [Op.like]: "%" + req.body.palabraclave + "%" } },
      ],
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

  res.render("buscados", {
    title: "Fotasa App",
    posts: buscador,
    nick: req.session.nickusuario,
  });
};
