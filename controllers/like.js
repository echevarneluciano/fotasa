const { Like } = require("../models");

exports.likea = async function (req, res) {
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
};
