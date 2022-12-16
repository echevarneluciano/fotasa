const { User } = require("../models");

exports.perfil = async function (req, res) {
  let usuario = await User.findByPk(req.session.idusuario);
  res.render("perfil", {
    title: `Perfil de ${req.session.nickusuario}`,
    usuario: usuario,
    nick: req.session.nickusuario,
  });
};

exports.actualizar = async function (req, res) {
  let usuario = await User.update(
    {
      nombre: req.body.nombre,
      intereses: req.body.intereses,
    },
    { where: { id: req.body.id } }
  );
  res.redirect("/user/perfil");
};
