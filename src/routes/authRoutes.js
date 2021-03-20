const { Router } = require("express");
const ValidationAuth = require("../validations/ValidationAuth");
const AuthController = require("../controllers/AuthController");
const authMiddleware = require("../middleware/auth");
const redisMiddleware = require("../middleware/redis");
const cache_me = require("../middleware/redisCache");

const routes = Router();


routes.post("/", ValidationAuth.login, AuthController.login);

routes.post("/me", authMiddleware, redisMiddleware, cache_me, AuthController.me);

module.exports = routes;
