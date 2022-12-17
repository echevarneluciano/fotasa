var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
const { User } = require("./models");
const { auth, requiresAuth } = require("express-openid-connect");

var app = express();

const sessionMiddleware = app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: "http://localhost:3000",
  clientID: "uI9MzRMne1EEiyqm1HPFqDvWvykJnbbz",
  issuerBaseURL: "https://dev-5xespcu4ztxudvil.us.auth0.com",
  secret: "LONG_RANDOM_STRING",
};

app.use(auth(config), async function (req, res, next) {
  if (req.oidc.user) {
    let usuario = await User.findOrCreate({
      where: { nick: req.oidc.user.nickname, mail: req.oidc.user.email },
    });
    req.session.idusuario = usuario[0].id;
    req.session.nickusuario = usuario[0].nick;
    next();
  } else console.log("no logeado"), next();
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var muroRouter = require("./routes/muro");
var likeRouter = require("./routes/like");
var buscarRouter = require("./routes/search");
var commentRouter = require("./routes/comment");
var publicRouter = require("./routes/public");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", requiresAuth(), userRouter);
app.use("/muro", requiresAuth(), muroRouter);
app.use("/like", requiresAuth(), likeRouter);
app.use("/buscar", requiresAuth(), buscarRouter);
app.use("/comment", requiresAuth(), commentRouter);
app.use("/public", publicRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
