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
  let imagenes;
  let usuario = req.body[0].userid;
  imagenes = req.body.map((i) => {
    return i.id;
  });
  console.log(imagenes);
  if (usuario) {
    let result = await Img.update(
      { userid: usuario },
      {
        where: {
          id: imagenes,
        },
      }
    );
    res.json(result);
  }
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
