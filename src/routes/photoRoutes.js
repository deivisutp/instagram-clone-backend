const { Router } = require("express");
const multer = require("multer");
const multerConfig = require("../config/multer");
const upload = multer(multerConfig).single("file");

const PhotoController = require("../controllers/PhotoController");
const authMiddleware = require("../middleware/auth");

const routes = Router();

routes.use(authMiddleware);

routes.get("/:id", PhotoController.show);
routes.delete("/:id", PhotoController.destroy);
routes.post("/", upload, PhotoController.store);

module.exports = routes;