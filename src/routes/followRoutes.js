const { Router } = require("express");

const authMiddleware = require("../middleware/auth");
const FollowController = require("../controllers/FollowController");

const routes = Router();

routes.post("/:user_id", authMiddleware, FollowController.store);

module.exports = routes;