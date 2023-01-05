const { User, Img } = require("../models");

exports.perfil = async function (req, res) {
  let usuario = await User.findByPk(req.session.idusuario);
  res.render("perfil", {
    title: `Perfil de ${req.session.nickusuario}`,
    usuario: usuario,
    nick: req.session.nickusuario,
  });
};

exports.misimagenes = async function (req, res) {
  let imagenes = await Img.findAll({
    where: { userid: req.session.idusuario },
  });
  let usuarios = await User.findAll();

  res.render("misimagenes", {
    title: `Mis imagenes`,
    imagenes: imagenes,
    usuarios: usuarios,
    nick: req.session.nickusuario,
  });
};

exports.transferir = async function (req, res) {
  console.log(req.body);
  //res.json(req.body);
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
