const express = require("express");
const router = express.Router();
const Coin = require("../models/coinModel");
const User = require("../models/userModel");
const coinController = require("../controllers/coinController");
const userController = require("../controllers/userController");
const tokenController = require("../controllers/tokenController");
const coinMiddleware = require("../middleware/coinMiddleware");
const tokenMiddleware = require("../middleware/tokenMiddleware");

router.get("/", async (req, res) => {
    res.send("healthcheck is OK").json();
})

module.exports = router;