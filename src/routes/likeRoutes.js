const { Router } = require("express");

const authMiddleware = require("../middleware/auth");
const LikeController = require("../controllers/LikeController");

const routes = Router();

routes.post("/:photo", authMiddleware, LikeController.store);

module.exports = routes;