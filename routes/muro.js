var express = require("express");
var router = express.Router();
const multer = require("multer");
const SharpMulter = require("sharp-multer");

const storage = SharpMulter({
  destination: (req, file, callback) => callback(null, "public/images"),
  imageOptions: {
    fileFormat: "jpg",
    quality: 100,
    //resize: { width: 500, height: 500 },
  },
});
const upload = multer({ storage });

router.get("/", function (req, res) {
  res.render("muro", { title: "Fotasa App" });
});

router.post("/upload", upload.single("imagen"), async (req, res) => {
  console.log(req.file);
  return res.json("File Uploaded Successfully!");
});

module.exports = router;
