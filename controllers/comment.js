var { Comentario } = require("../models");

exports.comentar = async function (req, res) {
  let comentarBD = {
    descripcion: `${req.session.nickusuario}: ${req.body.comentario}`,
    userid: req.session.idusuario,
    posteoid: req.body.postid,
  };
  let comentario = await Comentario.create(comentarBD);
  res.json(comentario);
};
