const { Router } = require("express");
const ValidationAuth = require("../validations/ValidationAuth");
const AuthController = require("../controllers/AuthController");
const authMiddleware = require("../middleware/auth");
//const redisMiddleware = require("../middleware/redis");   --Retirado Redis
//const cache_me = require("../middleware/redisCache");     --Retirado Redis

const routes = Router();


routes.post("/", ValidationAuth.login, AuthController.login);

//routes.get("/me", authMiddleware, redisMiddleware, cache_me, AuthController.me); --Retirado Redis
routes.get("/me", authMiddleware, AuthController.me);

module.exports = routes;
