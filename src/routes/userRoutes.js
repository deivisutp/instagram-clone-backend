const { Router } = require("express");
const multer = require("multer");
const multerConfig = require("../config/multer");

const UserController = require("../controllers/UserController");
const ValidationUser = require("../validations/validationUser");
const SearchController = require("../controllers/SearchController");

/**MiddlerWares */
const authMiddleware = require("../middleware/auth");
const routes = Router();

routes.get("/:username", authMiddleware, UserController.show);
routes.post("/", ValidationUser.withPassword, UserController.store);
routes.put("/", authMiddleware, ValidationUser.withoutPassword, UserController.update);
routes.put("/password-update", authMiddleware, ValidationUser.password, UserController.updatePassword);
routes.put("/avatar", authMiddleware, multer(multerConfig).single("file"), UserController.updateAvatar);
routes.get("/search/:term", authMiddleware, SearchController.search);

module.exports = routes;