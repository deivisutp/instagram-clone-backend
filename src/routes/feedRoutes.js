const { Router } = require("express");

const FeedController = require("../controllers/FeedController");
const authMiddleware = require("../middleware/auth");
const routes = Router();

routes.use(authMiddleware);

routes.get("/", FeedController.show);
routes.get("/follows", FeedController.showFollow);

module.exports = routes;