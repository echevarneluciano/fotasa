var { Img, Posteo, User, Comentario } = require("../models");
const { Op } = require("sequelize");

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
  res.render("buscados", {
    title: "Fotasa App",
    posts: buscador,
    nick: req.session.nickusuario,
  });
};
