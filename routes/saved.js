var express = require("express");
var router = express.Router();

var saved = require("../controllers/saved_controller");

router.get("/", saved.index);

module.exports = router;
